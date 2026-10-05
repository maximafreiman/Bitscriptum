// ============================================================
// PAGE 19 · BAB 16 · NAVIGATION
// ============================================================
function showSectionInContentB16(sectionId, sbId) {
  document.querySelectorAll('#page-bab16 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab16 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab16-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 19 · BAB 16 · TOPBAR
// ============================================================
document.getElementById('back-home-b16').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b16').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 19 · BAB 16 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab16').addEventListener('click', () => navigate('page-bab16'));

// ============================================================
// PAGE 19 · BAB 16 · SIDEBAR EVENTS (16.1 - 16.6)
// ============================================================
document.getElementById('sb-16-1').addEventListener('click', () => showSectionInContentB16('section-16-1', 'sb-16-1'));
document.getElementById('sb-16-2').addEventListener('click', () => showSectionInContentB16('section-16-2', 'sb-16-2'));
document.getElementById('sb-16-3').addEventListener('click', () => showSectionInContentB16('section-16-3', 'sb-16-3'));
document.getElementById('sb-16-4').addEventListener('click', () => showSectionInContentB16('section-16-4', 'sb-16-4'));
document.getElementById('sb-16-5').addEventListener('click', () => showSectionInContentB16('section-16-5', 'sb-16-5'));
document.getElementById('sb-16-6').addEventListener('click', () => showSectionInContentB16('section-16-6', 'sb-16-6'));

// ============================================================
// PAGE 19 · BAB 16 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab16 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB16(target, sb);
  });
});

// ============================================================
// PAGE 19 · BAB 16 · 16.6 SIMULATION (10 Daily Commands)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CMDS=[
    {num:1,code:'bitcoin-cli getblockchaininfo',
     when:'Every day — the first check when you open the terminal',
     why:'One command to know everything: whether the node is synced, the latest block, whether it’s still in IBD, whether pruning is active. This is your node’s main dashboard.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":               ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "headers":              ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "verificationprogress": ','s166-tb'],['0.9999982341','s166-tn'],[',','s166-tgy'],
       ['  "initialblockdownload": ','s166-tb'],['false','s166-tbt'],[',','s166-tgy'],
       ['  "pruned":               ','s166-tb'],['false','s166-tbf'],[',','s166-tgy'],
       ['  "difficulty":           ','s166-tb'],['88171509232073.27','s166-tn'],
       ['  ...','s166-tcm'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"initialblockdownload"',v:'false',d:'false = the node is synced and ready. true = don’t trust data from this node yet.'},
       {k:'"verificationprogress"',v:'0.9999982341',d:'The closer to 1.0, the more synced your node is with the latest chain.'},
     ]},
    {num:2,code:'bitcoin-cli getnetworkinfo',
     when:'When the node feels slow or isn’t receiving new blocks',
     why:'Check whether your node is still connected to the network. Low in/out connections can mean a firewall, internet, or peer-ban problem.',
     output:[
       ['{','s166-tgy'],
       ['  "connections":     ','s166-tb'],['18','s166-tn'],[',','s166-tgy'],
       ['  "connections_in":  ','s166-tb'],['8','s166-tn'],[',','s166-tgy'],
       ['  "connections_out": ','s166-tb'],['10','s166-tn'],[',','s166-tgy'],
       ['  "networkactive":   ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "relayfee":        ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"connections_out"',v:'10',d:'At least 8 outbound for optimal security. If 0, your node is offline.'},
       {k:'"networkactive"',v:'true',d:'false means the node is deliberately set offline. Use setnetworkactive true to reactivate it.'},
     ]},
    {num:3,code:'bitcoin-cli getmempoolinfo',
     when:'Before sending a transaction — check the fee market conditions',
     why:'If the mempool is full, the fee for fast confirmation will be expensive. If it’s nearly empty, you can send with the minimum fee. Real-time data from your own node.',
     output:[
       ['{','s166-tgy'],
       ['  "loaded":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "size":           ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "bytes":          ','s166-tb'],['47291834','s166-tn'],[',','s166-tgy'],
       ['  "mempoolminfee":  ','s166-tb'],['0.00001000','s166-tn'],[',','s166-tgy'],
       ['  "minrelaytxfee":  ','s166-tb'],['0.00001000','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"size"',v:'18432',d:'The number of transactions waiting for confirmation in the mempool.'},
       {k:'"bytes"',v:'47291834',d:'~47 MB = the mempool is fairly full, fees need to be higher for fast confirmation.'},
       {k:'"mempoolminfee"',v:'0.00001000',d:'The minimum fee your node’s mempool accepts. Transactions below this won’t be relayed.'},
     ]},
    {num:4,code:'bitcoin-cli getblockcount',
     when:'Quick check — what the block height is now',
     why:'The lightest command. The output is a single number. Useful for automation scripts or when you just need the block height without other info.',
     output:[['870142','s166-tn']],
     fields:[
       {k:'output',v:'870142',d:'A direct integer — the latest block height. Compare with a public explorer to verify sync.'},
     ]},
    {num:5,code:'bitcoin-cli gettxoutsetinfo',
     when:'Weekly audit — verify the total Bitcoin supply',
     why:'The only way to independently verify that the total Bitcoin doesn’t exceed 21 million. No central bank, no external audit — your node proves it.',
     output:[
       ['{','s166-tgy'],
       ['  "height":       ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "txouts":       ','s166-tb'],['184218954','s166-tn'],[',','s166-tgy'],
       ['  "disk_size":    ','s166-tb'],['11284716032','s166-tn'],[',','s166-tgy'],
       ['  "total_amount": ','s166-tb'],['19720483.12847291','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"total_amount"',v:'19,720,483 BTC',d:'Total BTC in circulation. Must always be below 21 million. If more, something is very wrong.'},
       {k:'"txouts"',v:'184,218,954',d:'The current number of UTXOs. The larger it is, the more RAM the node needs.'},
     ]},
    {num:6,code:'bitcoin-cli getpeerinfo',
     when:'Troubleshooting connections or checking a problematic peer',
     why:'See the details of all peers: where they’re from, what software version, what block they’ve synced to, how much bandwidth they use.',
     output:[
       ['[','s166-tgy'],
       ['  {','s166-tgy'],
       ['    "addr":          ','s166-tb'],['"203.0.113.42:8333"','s166-ts'],[',','s166-tgy'],
       ['    "version":       ','s166-tb'],['70016','s166-tn'],[',','s166-tgy'],
       ['    "subver":        ','s166-tb'],['"\/Satoshi:27.0.0\/"','s166-ts'],[',','s166-tgy'],
       ['    "synced_blocks": ','s166-tb'],['870142','s166-tn'],
       ['    ...','s166-tcm'],
       ['  }','s166-tgy'],
       ['  ...','s166-tcm'],
       [']','s166-tgy'],
     ],
     fields:[
       {k:'"synced_blocks"',v:'870142',d:'The last block this peer is known to have validated. If far behind, this peer isn’t useful for IBD.'},
       {k:'"subver"',v:'"/Satoshi:27.0.0/"',d:'The software version the peer runs. Useful for monitoring version distribution across the network.'},
     ]},
    {num:7,code:'bitcoin-cli estimatesmartfee 6',
     when:'Before sending a transaction — estimate the right fee',
     why:'How much fee is needed for the transaction to be confirmed within 6 blocks (~1 hour)? Data from your own node’s mempool, not from a third-party service.',
     output:[
       ['{','s166-tgy'],
       ['  "feerate": ','s166-tb'],['0.00012340','s166-tn'],[',','s166-tgy'],
       ['  "blocks":  ','s166-tb'],['6','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"feerate"',v:'0.00012340',d:'The fee rate in BTC/kB for confirmation within 6 blocks. Calculated from your own node’s mempool data.'},
       {k:'"blocks"',v:'6',d:'Replace with 1 to estimate the next-block fee, or 144 for a cheap fee (~1 day).'},
     ]},
    {num:8,code:'bitcoin-cli getmininginfo',
     when:'Monitor difficulty and network security conditions',
     why:'See the current difficulty, the network hashrate estimate, and how many blocks have been mined in this difficulty adjustment period.',
     output:[
       ['{','s166-tgy'],
       ['  "blocks":        ','s166-tb'],['870142','s166-tn'],[',','s166-tgy'],
       ['  "difficulty":    ','s166-tb'],['88171509232073.27','s166-tn'],[',','s166-tgy'],
       ['  "networkhashps": ','s166-tb'],['6.847e+20','s166-tn'],[',','s166-tgy'],
       ['  "pooledtx":      ','s166-tb'],['18432','s166-tn'],[',','s166-tgy'],
       ['  "chain":         ','s166-tb'],['"main"','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"difficulty"',v:'88,171,509,232,073',d:'The current difficulty. A larger number = a more secure network.'},
       {k:'"networkhashps"',v:'6.847e+20',d:'~685 exahash/s = the total network hashrate. The larger it is, the harder it is to attack.'},
     ]},
    {num:9,code:'bitcoin-cli getwalletinfo',
     when:'Check the node wallet’s balance and status',
     why:'See the total balance, transaction count, whether the wallet is rescanning, and whether the wallet is encrypted. Data directly from your node, not a third-party server.',
     output:[
       ['{','s166-tgy'],
       ['  "walletname":          ','s166-tb'],['"default"','s166-ts'],[',','s166-tgy'],
       ['  "balance":             ','s166-tb'],['0.12847291','s166-tn'],[',','s166-tgy'],
       ['  "unconfirmed_balance": ','s166-tb'],['0.00000000','s166-tn'],[',','s166-tgy'],
       ['  "txcount":             ','s166-tb'],['47','s166-tn'],[',','s166-tgy'],
       ['  "unlocked_until":      ','s166-tb'],['0','s166-tn'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"balance"',v:'0.12847291 BTC',d:'The confirmed balance. Verified directly from your node’s chainstate.'},
       {k:'"unlocked_until"',v:'0',d:'0 = the wallet is locked. Always lock the wallet after you’re done using it.'},
     ]},
    {num:10,code:'bitcoin-cli validateaddress "bc1qar0srrr..."',
     when:'Before receiving a payment — validate the address',
     why:'Verify that the Bitcoin address you’re using is valid and correctly formatted. Prevents the mistake of sending to an invalid address.',
     output:[
       ['{','s166-tgy'],
       ['  "isvalid":         ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "address":         ','s166-tb'],['"bc1qar0srrr7xfkvy5l643..."','s166-ts'],[',','s166-tgy'],
       ['  "iswitness":       ','s166-tb'],['true','s166-tbt'],[',','s166-tgy'],
       ['  "witness_version": ','s166-tb'],['0','s166-tn'],[',','s166-tgy'],
       ['  "witness_program": ','s166-tb'],['"e8df018c7e326cc253fae05bc7..."','s166-ts'],
       ['}','s166-tgy'],
     ],
     fields:[
       {k:'"isvalid"',v:'true',d:'true = this address is valid. false = wrong address, don’t send here.'},
       {k:'"iswitness"',v:'true',d:'true = this is a SegWit address (bc1...). More efficient than a legacy address.'},
       {k:'"witness_version"',v:'0',d:'0 = SegWit v0. 1 = Taproot (bc1p...). Determines the type of script used.'},
     ]},
  ];

  let currentIdx=0;

  function runCmd(idx){
    currentIdx=idx;
    document.querySelectorAll('.b16-s166-cmd').forEach((b,i)=>b.classList.toggle('s166-act',i===idx));
    const data=CMDS[idx];if(!data) return;

    const termCmd=g('b16-s166-term-cmd');
    if(termCmd) termCmd.textContent=data.code;

    const body=g('b16-s166-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s166-tg">satoshi@node</span><span class="s166-tgy">:~$</span> <span class="s166-tw"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s166-tcm'||tr.endsWith(',')) flush();
    });
    flush();

    const explain=g('b16-s166-explain');if(!explain) return;
    explain.innerHTML='';
    const head=document.createElement('div');head.className='b16-s166-explain-head';
    head.innerHTML=`<div class="b16-s166-explain-num">${data.num}</div>
      <div class="b16-s166-explain-body">
        <div class="b16-s166-explain-title">${data.code}</div>
        <div class="b16-s166-explain-when">📅 When: ${data.when}</div>
        <div class="b16-s166-explain-why">Why: ${data.why}</div>
      </div>`;
    explain.appendChild(head);

    if(data.fields&&data.fields.length){
      const fe=document.createElement('div');fe.className='b16-s166-fe';
      const lbl=document.createElement('div');lbl.className='b16-s166-fe-lbl';lbl.textContent='Key fields:';
      fe.appendChild(lbl);
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s166-field';
        row.innerHTML=`<div class="b16-s166-fk">${f.k}</div><div class="b16-s166-fv">${f.v}</div><div class="b16-s166-fd">${f.d}</div>`;
        fe.appendChild(row);
      });
      explain.appendChild(fe);
    }
  }

  (function(){
    const el=g('b16-s166-grid');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s166-cmd'+(i===0?' s166-act':'');
      btn.innerHTML=`<div class="b16-s166-cmd-num">${c.num}</div>
        <div class="b16-s166-cmd-code">${c.code}</div>
        <div class="b16-s166-cmd-when">${c.when.split('—')[0].trim()}</div>
        <div class="b16-s166-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runCmd(i));
      el.appendChild(btn);
    });
  })();

  runCmd(0);
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.5 SIMULATION (assumevalid & assumeUTXO)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const MODES={
    full:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download all headers (80 bytes/block)',desc:'~70 MB total for the entire blockchain. Fast.',time:'~5 minutes'},
        {cls:'s165-done',icon:'⬇️',title:'Download all block data',desc:'~650 GB total. This takes the longest in terms of download time.',time:'~2-12 hours'},
        {cls:'s165-done',icon:'✅',title:'Validate each block’s structure',desc:'Proof-of-work, timestamp, size, merkle root — every block from genesis.',time:'~1-3 hours'},
        {cls:'s165-done',icon:'🔐',title:'Verify ALL signatures',desc:'This is the most CPU-intensive. Every input of every transaction of every block is verified.',time:'~10-50 hours'},
        {cls:'s165-done',icon:'🗃️',title:'Build the UTXO set from genesis',desc:'Every output is added, every spent one is removed. The end result: an accurate chainstate.',time:'~1-2 hours'},
      ],
      trust:'A full IBD requires no trust in anyone — every byte, every signature is verified by your own node. This is the gold standard of Bitcoin verification. Use -assumevalid=0 to enable this mode.',
    },
    assumevalid:{
      phases:[
        {cls:'s165-done',icon:'⬇️',title:'Download all headers',desc:'~70 MB. Identical to a full IBD.',time:'~5 minutes'},
        {cls:'s165-done',icon:'⬇️',title:'Download all block data',desc:'~650 GB. Blocks are still downloaded entirely — nothing is skipped.',time:'~2-12 hours'},
        {cls:'s165-done',icon:'✅',title:'Validate each block’s structure',desc:'Proof-of-work, timestamp, size, merkle root — still validated for all blocks.',time:'~1-3 hours'},
        {cls:'s165-skip',icon:'⏩',title:'Old block signatures SKIPPED',desc:'For blocks before the assumevalid hash, signatures aren’t verified. This saves the most time.',time:'skipped'},
        {cls:'s165-done',icon:'🗃️',title:'Build the UTXO set from genesis',desc:'The UTXO set is still built fully from all transactions. No shortcut here.',time:'~1-2 hours'},
      ],
      trust:'assumevalid isn’t blind trust. If the hardcoded hash is wrong, the node will build a UTXO set that conflicts with the network and is caught immediately. The source code is open and audited by thousands of developers. You can also disable it with -assumevalid=0 anytime.',
    },
    assumeutxo:{
      phases:[
        {cls:'s165-snap',icon:'📦',title:'Load the UTXO set snapshot (~11 GB)',desc:'The snapshot file contains all UTXOs at a particular block height.',time:'~5-10 minutes'},
        {cls:'s165-done',icon:'🔍',title:'Verify the snapshot hash',desc:'The node verifies that the snapshot hash matches the hardcoded one. If it doesn’t match, it’s rejected.',time:'~1 minute'},
        {cls:'s165-done',icon:'✅',title:'The node operates immediately',desc:'After the snapshot is verified, the node can already validate new transactions and the latest blocks.',time:'DONE ✓'},
        {cls:'s165-bg',  icon:'🔄',title:'Historical verification in the background',desc:'The node downloads and verifies the blockchain from genesis in the background while still operating normally.',time:'~4-8 hours (bg)'},
        {cls:'s165-done',icon:'🎯',title:'Background sync complete',desc:'The chainstate from the snapshot has been independently verified. The node is equivalent to a normal IBD.',time:'~4-8 hours total'},
      ],
      trust:'assumeUTXO uses a snapshot whose hash is hardcoded and can be audited by anyone. If the snapshot contains the wrong UTXO, the background verification will find the inconsistency. The design ensures the node will self-correct even if the snapshot is wrong.',
    },
  };

  let currentMode='full';

  function renderMode(mode){
    const data=MODES[mode];if(!data) return;
    const phases=g('b16-s165-phases');const trust=g('b16-s165-trust');
    if(phases){
      phases.innerHTML='';
      data.phases.forEach(p=>{
        const div=document.createElement('div');div.className=`b16-s165-phase ${p.cls}`;
        div.innerHTML=`<div class="b16-s165-phase-icon">${p.icon}</div>
          <div class="b16-s165-phase-body">
            <div class="b16-s165-phase-title">${p.title}</div>
            <div class="b16-s165-phase-desc">${p.desc}</div>
          </div>
          <div class="b16-s165-phase-time">${p.time}</div>`;
        phases.appendChild(div);
      });
    }
    if(trust){
      trust.innerHTML=`<div class="b16-s165-trust-label">Trust analysis (trust model):</div>
        <div class="b16-s165-trust-text">${data.trust}</div>`;
    }
  }

  const modeEl=g('b16-s165-modes');
  if(modeEl) modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      modeEl.querySelectorAll('.b16-s165-mode-btn').forEach(b=>b.classList.remove('s165-act'));
      btn.classList.add('s165-act');
      currentMode=btn.dataset.mode;
      renderMode(currentMode);
    });
  });
  renderMode('full');

  // RPC
  const CMDS=[
    {id:'getblockchaininfo_av',code:'bitcoin-cli getblockchaininfo',hint:'Check assumevalid status',
     output:[
       ['{','s165-tgy'],
       ['  "blocks":               ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['  "verificationprogress": ','s165-tb'],['0.9999982341','s165-tn'],[',','s165-tgy'],
       ['  "chainwork":            ','s165-tb'],['"00000000000000000000000000000000000000007b4e..."','s165-ts'],[',','s165-tgy'],
       ['  "initialblockdownload": ','s165-tb'],['false','s165-tbt'],
       ['  ...','s165-tcm'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"verificationprogress"',v:'0.9999982341',d:'Sync progress approaching 1.0 means the node is nearly done. Calculated from chainwork, not block count.'},
       {k:'"chainwork"',v:'"00000...7b4e"',d:'Total accumulated proof-of-work. Compared with the assumevalid hash to determine which blocks have their signatures skipped.'},
     ],
     note:'The assumevalid hash is hardcoded in the source code and updated each new release. To see the value used, check the source code or use -assumevalid=0 to disable it.'},
    {id:'assumevalid_disable',code:'bitcoind -assumevalid=0',hint:'Disable assumevalid (full verification)',
     output:[
       ['# Run bitcoind with this flag for a full IBD','s165-tcm'],
       ['# All signatures from block 0 will be verified','s165-tcm'],
       ['# Estimated time: 3-10x longer than default','s165-tcm'],
       ['','s165-tgy'],
       ['Bitcoin Core starting...','s165-tw'],
       ['Loaded 0 addresses from peers.dat','s165-tgy'],
       ['assumevalid is disabled, verifying all signatures','s165-tn'],
       ['UpdateTip: new best=00000...a4b height=1 ...','s165-tgy'],
     ],
     fields:[
       {k:'-assumevalid=0',v:'disable',d:'Fully disables assumevalid. The node will verify every signature from the genesis block.'},
       {k:'alternative',v:'-assumevalid=hash',d:'Can be set to a particular block hash to define your own assumevalid cutoff point.'},
     ],
     note:'Use -assumevalid=0 if you want the most thorough verification. The process is far longer but gives the highest security guarantee without any trust in the developers.'},
    {id:'loadtxoutset',code:'bitcoin-cli loadtxoutset /path/to/utxo-870000.dat',hint:'Load an assumeUTXO snapshot',
     output:[
       ['{','s165-tgy'],
       ['  "coins_loaded":  ','s165-tb'],['184218954','s165-tn'],[',','s165-tgy'],
       ['  "tip_hash":      ','s165-tb'],['"00000000000000000001a4b..."','s165-ts'],[',','s165-tgy'],
       ['  "base_height":   ','s165-tb'],['870000','s165-tn'],[',','s165-tgy'],
       ['  "path":          ','s165-tb'],['"\/path\/to\/utxo-870000.dat"','s165-ts'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'"coins_loaded"',v:'184,218,954',d:'The number of UTXOs successfully loaded from the snapshot.'},
       {k:'"base_height"',v:'870000',d:'The block height of the snapshot. The node can validate blocks above this height immediately after the snapshot is loaded.'},
       {k:'"tip_hash"',v:'"00000...a4b"',d:'The tip block hash of the snapshot. Verified to match the hardcoded one before being used.'},
     ],
     note:'An assumeUTXO snapshot file can be obtained from various sources — but always verify its hash. The node will reject a snapshot whose hash doesn’t match the one hardcoded in the source code.'},
    {id:'getchainstates',code:'bitcoin-cli getchainstates',hint:'Background sync status after assumeUTXO',
     output:[
       ['{','s165-tgy'],
       ['  "chainstates": [','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['true','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['870142','s165-tn'],[',','s165-tgy'],
       ['      "snapshot_blockhash":','s165-tb'],['"00000...a4b"','s165-ts'],
       ['    },','s165-tgy'],
       ['    {','s165-tgy'],
       ['      "active":           ','s165-tb'],['false','s165-tbt'],[',','s165-tgy'],
       ['      "blocks":           ','s165-tb'],['423819','s165-tn'],[',','s165-tgy'],
       ['      # background verification: 48.7% complete','s165-tcm'],
       ['    }','s165-tgy'],
       ['  ]','s165-tgy'],
       ['}','s165-tgy'],
     ],
     fields:[
       {k:'active chainstate [0]',v:'blocks: 870142',d:'The chainstate from the snapshot used to validate new transactions. Already at the latest block.'},
       {k:'background chainstate [1]',v:'blocks: 423819',d:'Background verification is at block 423,819 of 870,142. ~48.7% complete.'},
       {k:'"snapshot_blockhash"',v:'"00000...a4b"',d:'The snapshot hash used. null on the background chainstate means this is a normal IBD from genesis.'},
     ],
     note:'getchainstates shows two chainstates running in parallel: one from the snapshot (active) and one from genesis (background). After the background sync completes, the two are merged into one.'},
  ];

  let currentCmd=CMDS[0].id;
  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s165-cmd').forEach(b=>b.classList.toggle('s165-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s165-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s165-tg">satoshi@node</span><span class="s165-tgy">:~$</span> <span class="s165-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s165-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s165-fe'),fei=g('b16-s165-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s165-field';
        row.innerHTML=`<div class="b16-s165-fk">${f.k}</div><div class="b16-s165-fv">${f.v}</div><div class="b16-s165-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s165-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s165-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s165-cmd'+(i===0?' s165-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s165-cmd-code">${c.code}</div><div class="b16-s165-cmd-hint">${c.hint}</div><div class="b16-s165-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s165-t1'),t2=g('b16-s165-t2');
  const p1=g('b16-s165-p1'),p2=g('b16-s165-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s165-tab s165-act';t2.className='b16-s165-tab';
    p1.className='b16-s165-pane show';p2.className='b16-s165-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s165-tab s165-act';t1.className='b16-s165-tab';
    p2.className='b16-s165-pane show';p1.className='b16-s165-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_av');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.4 SIMULATION (Pruning Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const TOTAL_GB=650, TOTAL_BLOCKS=870142;

  function renderTL(pruneGB){
    const tl=g('b16-s164-tl');if(!tl) return;
    tl.innerHTML='';
    const prunedPct=Math.max(0,Math.min(95,(1-pruneGB/TOTAL_GB)*100));
    const keptPct=Math.max(3,100-prunedPct-2);
    const seg1=document.createElement('div');
    seg1.className='b16-s164-tl-seg s164-pruned';seg1.style.width=prunedPct+'%';
    const l1=document.createElement('div');l1.className='b16-s164-tl-seg-lbl';
    l1.textContent=prunedPct>18?'Block validated & deleted':'';seg1.appendChild(l1);
    const seg2=document.createElement('div');
    seg2.className='b16-s164-tl-seg s164-kept';seg2.style.width=keptPct+'%';
    const l2=document.createElement('div');l2.className='b16-s164-tl-seg-lbl';
    l2.textContent=keptPct>10?'Buffer':'';seg2.appendChild(l2);
    const seg3=document.createElement('div');
    seg3.className='b16-s164-tl-seg s164-recent';seg3.style.width='2%';
    tl.appendChild(seg1);tl.appendChild(seg2);tl.appendChild(seg3);
    const marker=g('b16-s164-prune-marker');
    if(marker){
      const pruneBlock=Math.round(TOTAL_BLOCKS*(1-pruneGB/TOTAL_GB));
      marker.textContent='Prune height ~#'+pruneBlock.toLocaleString('en-US');
    }
  }

  function updateStats(mb){
    const gb=mb/1024;
    const saved=Math.max(0,TOTAL_GB-gb);
    const prunedBlocks=Math.round(TOTAL_BLOCKS*(1-gb/TOTAL_GB));
    const neededEl=g('b16-s164-needed');
    const savedEl=g('b16-s164-saved');
    const pruneEl=g('b16-s164-pruned-blocks');
    if(neededEl) neededEl.textContent=mb>=1024?(mb/1024).toFixed(1)+' GB':mb+' MB';
    if(savedEl) savedEl.textContent='~'+Math.round(saved)+' GB';
    if(pruneEl) pruneEl.textContent='~'+prunedBlocks.toLocaleString('en-US');
  }

  const sl=g('b16-s164-sl');
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s164-sl-val');
    if(vEl) vEl.textContent=v>=1024?(v/1024).toFixed(1)+' GB':v+' MB';
    renderTL(v/1024);updateStats(v);
  });
  renderTL(0.55);updateStats(550);

  // RPC data — 3 normal + 2 error
  const CMDS=[
    {id:'getblockchaininfo_prune',code:'bitcoin-cli getblockchaininfo',hint:'Check pruning status',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned":            ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "pruneheight":       ','s164-tb'],['869592','s164-tn'],[',','s164-tgy'],
       ['  "automatic_pruning": ','s164-tb'],['true','s164-tbt'],[',','s164-tgy'],
       ['  "prune_target_size": ','s164-tb'],['576716800','s164-tn'],[',','s164-tgy'],
       ['  "blocks":            ','s164-tb'],['870142','s164-tn'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'true',d:'true = the node runs in pruning mode. false = a full archival node.',err:false},
       {k:'"pruneheight"',v:'869592',d:'The oldest block height still on disk. Blocks below this have been deleted. This number rises over time.',err:false},
       {k:'"prune_target_size"',v:'576716800',d:'The maximum target size of block files in bytes. 576,716,800 = 550 MB (the minimum value).',err:false},
     ],
     note:'"pruneheight" is the key to knowing which blocks are still accessible. If you want getblock for an old block, make sure its block height is above pruneheight.',
     noteType:'normal'},
    {id:'pruneblockchain',code:'bitcoin-cli pruneblockchain 850000',hint:'Manually prune up to a certain block',isErr:false,
     output:[['869142','s164-tn']],
     fields:[
       {k:'parameter: 850000',v:'target height',d:'The target block height for pruning. The node will delete old blocks up to near this height.',err:false},
       {k:'output: 869142',v:'actual height',d:'The actual block height that was pruned. Can be higher than the target if the node needs to keep undo data for the last few blocks.',err:false},
     ],
     note:'Manual pruning can only be done if prune=1 in bitcoin.conf (manual mode) or the node is already in pruning mode. It can’t be run on a full archival node.',
     noteType:'normal'},
    {id:'getblockchaininfo_full',code:'bitcoin-cli getblockchaininfo  # full archival',hint:'Full archival node (pruning off)',isErr:false,
     output:[
       ['{','s164-tgy'],
       ['  "pruned": ','s164-tb'],['false','s164-tbf'],[',','s164-tgy'],
       ['  # pruneheight is not in the output','s164-tcm'],
       ['  # all blocks from genesis are available','s164-tcm'],
       ['  ...','s164-tcm'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'"pruned"',v:'false',d:'false = a full archival node. All blocks are available. "pruneheight" doesn’t appear.',err:false},
       {k:'storage needed',v:'~650 GB+',d:'Full archival stores all blocks since genesis. Grows ~50-60 GB per year.',err:false},
     ],
     note:'A full archival node can serve old blocks to peers doing IBD — contributing more to the network. It needs far more storage but is better for network health.',
     noteType:'normal'},
    {id:'err_getblock',code:'bitcoin-cli getblock "00000...old" 1',hint:'NOT possible on a pruned node',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-1','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],['"Block not available (pruned data)"','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -1',v:'Block not available',d:'The node returns this error if you try to access a block that has been pruned and is no longer on disk.',err:true},
       {k:'solution',v:'use an archival node',d:'To access a historical block, you need a full archival node or a block explorer service like mempool.space.',err:true},
     ],
     note:'This is the error pruned-node users most often encounter. If you need access to historical blocks regularly, consider not enabling pruning.',
     noteType:'err'},
    {id:'err_getrawtx',code:'bitcoin-cli getrawtransaction "txid"',hint:'NOT possible without txindex',isErr:true,
     output:[
       ['error: ','s164-terr'],
       ['{','s164-tgy'],
       ['  "code":    ','s164-tb'],['-5','s164-tn'],[',','s164-tgy'],
       ['  "message": ','s164-tb'],
       ['"No such mempool transaction.','s164-terr'],
       [' Use -txindex or provide a block hash','s164-terr'],
       [' to enable blockchain transaction queries."','s164-terr'],
       ['}','s164-tgy'],
     ],
     fields:[
       {k:'error code: -5',v:'No such mempool tx',d:'The node can’t look up a historical transaction without txindex because a pruned node has no transaction index.',err:true},
       {k:'solution 1: -txindex',v:'incompatible',d:'txindex can’t be run together with pruning. You have to choose one.',err:true},
       {k:'solution 2: block hash',v:'getblock "hash" 2',d:'If you know the block hash, use getblock with verbosity 2 — but only for blocks that haven’t been pruned.',err:true},
     ],
     note:'A pruned node + txindex are incompatible. If you need getrawtransaction for a historical transaction, you must run a full archival node with txindex=1 in bitcoin.conf.',
     noteType:'err'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s164-cmd').forEach(b=>b.classList.toggle('s164-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s164-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s164-tg">satoshi@node</span><span class="s164-tgy">:~$</span> <span class="s164-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||c==='s164-tcm'||c==='s164-terr'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s164-fe'),fei=g('b16-s164-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');
        row.className='b16-s164-field'+(f.err?' s164-err-field':'');
        row.innerHTML=`<div class="b16-s164-fk">${f.k}</div><div class="b16-s164-fv">${f.v}</div><div class="b16-s164-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s164-note');
    if(note){
      note.style.display='block';
      note.className='b16-s164-note '+(data.noteType==='err'?'s164-note-err':'s164-note-normal');
      note.textContent=data.note;
    }
  }

  (function(){
    const el=g('b16-s164-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s164-cmd'+(i===0?' s164-act':'')+(c.isErr?' s164-err':'');
      btn.dataset.id=c.id;
      let html=`<div class="b16-s164-cmd-code">${c.code}</div>`;
      if(c.isErr) html+=`<div class="b16-s164-cmd-badge">ERROR</div>`;
      html+=`<div class="b16-s164-cmd-hint">${c.hint}</div><div class="b16-s164-cmd-arrow">▶</div>`;
      btn.innerHTML=html;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s164-t1'),t2=g('b16-s164-t2');
  const p1=g('b16-s164-p1'),p2=g('b16-s164-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s164-tab s164-act';t2.className='b16-s164-tab';
    p1.className='b16-s164-pane show';p2.className='b16-s164-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s164-tab s164-act';t1.className='b16-s164-tab';
    p2.className='b16-s164-pane show';p1.className='b16-s164-pane';
    runRPC(currentCmd);
  });
  runRPC('getblockchaininfo_prune');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.3 SIMULATION (Chainstate Explorer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  // Animate bar
  setTimeout(()=>{
    const bar=g('b16-s163-bar');const txt=g('b16-s163-bar-text');
    if(bar) bar.style.width='1.7%';
    if(txt) txt.textContent='Chainstate 11 GB';
  },400);

  // dbcache slider
  const sl=g('b16-s163-cache-sl');
  const labels=[
    {max:900,  cls:'s163-bad',  text:'<strong>Default / Too small (< 900 MB):</strong> A cramped desk. The node often reads disk during IBD, sync is slower. Suitable only if RAM is very limited.'},
    {max:2000, cls:'s163-ok',   text:'<strong>Adequate (900 MB - 2 GB):</strong> A decent desk. IBD is faster than default. Suitable for a node with 4-8 GB RAM.'},
    {max:8000, cls:'s163-good', text:'<strong>Optimal (2 GB - 8 GB):</strong> A spacious desk. Most of the UTXO set fits in RAM. IBD is very fast. Recommended for a new node doing IBD.'},
  ];
  if(sl) sl.addEventListener('input',()=>{
    const v=parseInt(sl.value);
    const vEl=g('b16-s163-cache-val');
    if(vEl) vEl.textContent=v>=1000?(v/1000).toFixed(1)+' GB':v+' MB';
    const res=g('b16-s163-cache-result');if(!res) return;
    const lbl=labels.find(l=>v<=l.max)||labels[labels.length-1];
    res.className='b16-s163-cache-result '+lbl.cls;
    res.innerHTML=lbl.text;
  });

  // RPC data
  const CMDS=[
    {id:'gettxoutsetinfo',code:'bitcoin-cli gettxoutsetinfo',hint:'UTXO set statistics',
     output:[
       ['{','s163-tgy'],
       ['  "height":           ','s163-tb'],['870142','s163-tn'],[',','s163-tgy'],
       ['  "bestblock":        ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "txouts":           ','s163-tb'],['184218954','s163-tn'],[',','s163-tgy'],
       ['  "bogosize":         ','s163-tb'],['13847291823','s163-tn'],[',','s163-tgy'],
       ['  "muhash":           ','s163-tb'],['"a3f8c2e1d4b7..."','s163-ts'],[',','s163-tgy'],
       ['  "transactions":     ','s163-tb'],['152441089','s163-tn'],[',','s163-tgy'],
       ['  "disk_size":        ','s163-tb'],['11284716032','s163-tn'],[',','s163-tgy'],
       ['  "total_amount":     ','s163-tb'],['19720483.12847291','s163-tn'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"txouts"',v:'184,218,954',d:'The total UTXOs currently in existence. Each one is an unspent output across the entire Bitcoin network.'},
       {k:'"total_amount"',v:'19,720,483 BTC',d:'The sum of all UTXOs = total BTC in circulation. Can be used to verify that no BTC was created off-schedule.'},
       {k:'"disk_size"',v:'~11 GB',d:'The chainstate size on disk in bytes after LevelDB compression.'},
       {k:'"muhash"',v:'"a3f8c2e1..."',d:'A hash of the entire UTXO set using MuHash. Used to verify an assumeUTXO snapshot.'},
     ],
     note:'This command is a bit slow because it has to read the entire chainstate database. On a node with an SSD it usually finishes in 30-120 seconds. "total_amount" is the best way to verify that the Bitcoin supply is on schedule.'},
    {id:'gettxout',code:'bitcoin-cli gettxout "a1b2c3...txid" 0',hint:'Query one specific UTXO',
     output:[
       ['{','s163-tgy'],
       ['  "bestblock":    ','s163-tb'],['"00000000000000000001a4b..."','s163-ts'],[',','s163-tgy'],
       ['  "confirmations":','s163-tb'],['14382','s163-tn'],[',','s163-tgy'],
       ['  "value":        ','s163-tb'],['0.05000000','s163-tn'],[',','s163-tgy'],
       ['  "scriptPubKey": ','s163-tb'],['{','s163-tgy'],
       ['    "type":    ','s163-tb'],['"witness_v1_taproot"','s163-ts'],[',','s163-tgy'],
       ['    "address": ','s163-tb'],['"bc1p..."','s163-ts'],
       ['  }','s163-tgy'],[',','s163-tgy'],
       ['  "coinbase":     ','s163-tb'],['false','s163-tbt'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"value"',v:'0.05000000',d:'The UTXO value in BTC. The node stores this as satoshi (5,000,000 sat) in LevelDB.'},
       {k:'"confirmations"',v:'14382',d:'How many blocks have been confirmed since this UTXO was created. The larger, the older and safer this UTXO is.'},
       {k:'"type"',v:'"witness_v1_taproot"',d:'The type of locking script. Taproot = SegWit v1. This determines how the UTXO can be spent.'},
       {k:'"coinbase"',v:'false',d:'true means this UTXO is from a miner reward. A coinbase UTXO needs 100 confirmations before it can be spent.'},
     ],
     note:'If the output of this command is null, that UTXO has been spent or never existed. A direct way to check whether an output can still be used.'},
    {id:'getmemoryinfo',code:'bitcoin-cli getmemoryinfo',hint:'Node memory usage info',
     output:[
       ['{','s163-tgy'],
       ['  "locked": {','s163-tgy'],
       ['    "used":        ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "free":        ','s163-tb'],['393216','s163-tn'],[',','s163-tgy'],
       ['    "total":       ','s163-tb'],['458752','s163-tn'],[',','s163-tgy'],
       ['    "locked":      ','s163-tb'],['65536','s163-tn'],[',','s163-tgy'],
       ['    "chunks_used": ','s163-tb'],['2','s163-tn'],[',','s163-tgy'],
       ['    "chunks_free": ','s163-tb'],['1','s163-tn'],
       ['  }','s163-tgy'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"used"',v:'65536',d:'The memory currently used by the node in bytes. Excludes dbcache, which is managed separately.'},
       {k:'"total"',v:'458752',d:'Total memory allocated to the node (outside dbcache). ~448 KB for node overhead.'},
       {k:'"locked"',v:'65536',d:'Memory locked into RAM that can’t be swapped to disk. For sensitive data like wallet keys.'},
     ],
     note:'This command shows the node’s internal memory usage, excluding dbcache. To see total RAM usage including dbcache, use OS tools like "top" or "htop" and look for the bitcoind process.'},
    {id:'savemempool',code:'bitcoin-cli savemempool',hint:'Save the mempool to disk',
     output:[
       ['{','s163-tgy'],
       ['  "filename": ','s163-tb'],['"~/.bitcoin/mempool.dat"','s163-ts'],
       ['}','s163-tgy'],
     ],
     fields:[
       {k:'"filename"',v:'"mempool.dat"',d:'The file path where the mempool is saved. The node automatically loads this file on restart so transactions aren’t lost.'},
     ],
     note:'The node saves the mempool automatically on a normal shutdown. Use savemempool if you want to force a flush to disk — useful before a backup or a planned restart.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s163-cmd').forEach(b=>b.classList.toggle('s163-act',b.dataset.id===cmdId));
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;
    const body=g('b16-s163-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s163-tg">satoshi@node</span><span class="s163-tgy">:~$</span> <span class="s163-tw"> ${data.code}</span>`;
    body.appendChild(prompt);
    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([t,c])=>{const s=document.createElement('span');s.className=c;s.textContent=t;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([t,c])=>{
      buf.push([t,c]);
      const tr=t.trim();
      if(tr===','||tr==='{'||tr==='}'||tr==='['||tr===']'||c==='s163-tcm'||tr.endsWith(',')) flush();
    });
    flush();
    const fe=g('b16-s163-fe'),fei=g('b16-s163-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s163-field';
        row.innerHTML=`<div class="b16-s163-fk">${f.k}</div><div class="b16-s163-fv">${f.v}</div><div class="b16-s163-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s163-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  (function(){
    const el=g('b16-s163-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s163-cmd'+(i===0?' s163-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s163-cmd-code">${c.code}</div><div class="b16-s163-cmd-hint">${c.hint}</div><div class="b16-s163-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  const t1=g('b16-s163-t1'),t2=g('b16-s163-t2');
  const p1=g('b16-s163-p1'),p2=g('b16-s163-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s163-tab s163-act';t2.className='b16-s163-tab';
    p1.className='b16-s163-pane show';p2.className='b16-s163-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s163-tab s163-act';t1.className='b16-s163-tab';
    p2.className='b16-s163-pane show';p1.className='b16-s163-pane';
    runRPC(currentCmd);
  });
  runRPC('gettxoutsetinfo');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.2 SIMULATION (Block Inspector)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const CHECKS=[
    {icon:'📦',title:'1. Basic block structure valid',
     desc:'The node checks whether the block has all required fields: version, previousblockhash, merkleroot, time, bits, nonce. A block with a broken structure is rejected immediately.',
     val:'version=536870916, size=1,247,832 bytes — ok'},
    {icon:'⛏️',title:'2. Proof-of-Work valid',
     desc:'The hash of the block header must be below the current difficulty target. It can’t be faked without expending real energy. This check is the fastest and is done first.',
     val:'hash: 00000000000000000001a4b... < target: 0000000000000000000395... — VALID'},
    {icon:'🔗',title:'3. previousblockhash matches',
     desc:'The previousblockhash field must match the hash of the latest block the node has validated. This is what makes the blockchain impossible to change without recomputing the entire chain.',
     val:'00000000000000000002f... — matches tip #870141 ✓'},
    {icon:'🕐',title:'4. Timestamp within the allowed range',
     desc:'The timestamp must be greater than the Median Time Past (MTP) of the last 11 blocks, and no more than 2 hours in the future. This prevents time manipulation by miners.',
     val:'time=1717459200 > MTP=1717456800, delta from now=+12s — ok'},
    {icon:'📏',title:'5. Block size doesn’t exceed the limit',
     desc:'The total block weight may not exceed 4,000,000 weight units. Non-witness data counts 4x heavier than witness data.',
     val:'3,998,832 weight units < 4,000,000 limit — ok (99.97% full)'},
    {icon:'🪙',title:'6. Coinbase transaction valid',
     desc:'The reward claimed by the miner may not exceed the block subsidy plus the total fees of all transactions. A miner who overclaims will be rejected by the entire network.',
     val:'coinbase: 3.25437891 BTC = subsidy(3.125) + fees(0.12937891) — ok'},
    {icon:'🌳',title:'7. Merkle root matches all transactions',
     desc:'The node recomputes the merkle root from all txids and compares it with the one in the header. One manipulated transaction will change the merkle root entirely.',
     val:'merkle root: 4a5e1e4b... — matches 3,847 transactions ✓'},
    {icon:'✍️',title:'8. All transaction signatures valid',
     desc:'For every transaction input, the node runs the Bitcoin script and verifies the cryptographic signature. The most CPU-intensive part, run in parallel across all cores.',
     val:'3,847 tx, 12,341 inputs — all signatures valid ✓'},
  ];

  let step=-1;

  // Build checklist
  (function(){
    const el=g('b16-s162-checklist');if(!el) return;
    CHECKS.forEach((c,i)=>{
      const div=document.createElement('div');
      div.className='b16-s162-check';div.id=`s162c${i}`;
      div.innerHTML=`<div class="b16-s162-check-icon">${c.icon}</div>
        <div class="b16-s162-check-body">
          <div class="b16-s162-check-title">${c.title}</div>
          <div class="b16-s162-check-desc">${c.desc}</div>
          <div class="b16-s162-check-val" id="s162v${i}">${c.val}</div>
        </div>`;
      el.appendChild(div);
    });
  })();

  function updateVerdict(){
    const ind=g('b16-s162-ind'),verd=g('b16-s162-verdict'),btn=g('b16-s162-next');
    if(ind) ind.textContent=`${Math.max(0,step+1)} / ${CHECKS.length} checks`;
    if(btn) btn.disabled=step>=CHECKS.length-1;
    if(verd){
      if(step<0){verd.className='b16-s162-verdict s162-idle';verd.textContent='Click "Next Verification" — the node just received block #870,142 from a peer.';}
      else if(step<CHECKS.length-1){verd.className='b16-s162-verdict s162-prog';verd.textContent=`Checking: ${CHECKS[step].title.replace(/^\d+\. /,'')}`;}
      else{verd.className='b16-s162-verdict s162-ok';verd.textContent='All 8 checks pass. Block #870,142 is accepted and added to the local chain. The node forwards this block to other peers.';}
    }
  }

  const nextBtn=g('b16-s162-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{
    if(step<CHECKS.length-1){
      step++;
      const c=g(`s162c${step}`);if(c) c.className='b16-s162-check s162-done';
      updateVerdict();
    }
  });
  const rstBtn=g('b16-s162-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    step=-1;
    CHECKS.forEach((_,i)=>{const c=g(`s162c${i}`);if(c) c.className='b16-s162-check';});
    updateVerdict();
  });
  updateVerdict();

  // RPC data
  const CMDS=[
    {id:'getblockcount',code:'bitcoin-cli getblockcount',hint:'The current block count',
     output:[['870142','s162-tnum']],
     fields:[{k:'output',v:'870142',d:'A direct integer — the number of validated blocks. The genesis block = 0, so a total of 870,143 blocks in the chain.'}],
     note:'The lightest command to check the chain height. The output is a plain integer, not JSON. No wallet connection required.'},
    {id:'getbestblockhash',code:'bitcoin-cli getbestblockhash',hint:'The latest block hash',
     output:[['"00000000000000000001a4b2c8d9e7f3a6b5c4d1e2f0a9b8c7d6e5f4a3b2c1d0"','s162-tstr']],
     fields:[{k:'output',v:'"00000...c1d0"',d:'The 256-bit hash of the current block tip. Use this hash as the getblock argument to see block details.'}],
     note:'A block hash always starts with many zeros because of proof-of-work. The more leading zeros, the greater the difficulty required.'},
    {id:'getblock',code:'bitcoin-cli getblock "00000...a4b" 1',hint:'Full block details',
     output:[
       ['{','s162-tgray'],
       ['  "hash":              ','s162-tblue'],['"00000000000000000001a4b..."','s162-tstr'],[',','s162-tgray'],
       ['  "confirmations":     ','s162-tblue'],['1','s162-tnum'],[',','s162-tgray'],
       ['  "height":            ','s162-tblue'],['870142','s162-tnum'],[',','s162-tgray'],
       ['  "merkleroot":        ','s162-tblue'],['"4a5e1e4baab89f3a2f143..."','s162-tstr'],[',','s162-tgray'],
       ['  "time":              ','s162-tblue'],['1717459200','s162-tnum'],[',','s162-tgray'],
       ['  "mediantime":        ','s162-tblue'],['1717456800','s162-tnum'],[',','s162-tgray'],
       ['  "nonce":             ','s162-tblue'],['3826969040','s162-tnum'],[',','s162-tgray'],
       ['  "bits":              ','s162-tblue'],['"17034219"','s162-tstr'],[',','s162-tgray'],
       ['  "difficulty":        ','s162-tblue'],['88171509232073.27','s162-tnum'],[',','s162-tgray'],
       ['  "nTx":               ','s162-tblue'],['3847','s162-tnum'],[',','s162-tgray'],
       ['  "weight":            ','s162-tblue'],['3998832','s162-tnum'],[',','s162-tgray'],
       ['  "previousblockhash": ','s162-tblue'],['"00000000000000000002f..."','s162-tstr'],[',','s162-tgray'],
       ['  "tx": [ ... ]        ','s162-tcm'],['  # 3847 txids','s162-tcm'],
       ['}','s162-tgray'],
     ],
     fields:[
       {k:'"confirmations"',v:'1',d:'How many blocks have been built on top of this block. The latest block = 1. Increases each time a new block is found.'},
       {k:'"nTx"',v:'3847',d:'The number of transactions in the block, including the coinbase as the first transaction.'},
       {k:'"weight"',v:'3998832',d:'The total weight in weight units. Maximum 4,000,000. This block is 99.97% full.'},
       {k:'"nonce"',v:'3826969040',d:'The number the miner varies while mining. Range 0-4,294,967,295.'},
       {k:'"bits"',v:'"17034219"',d:'The difficulty target in compact format. Converted to 256-bit to compare with the block hash.'},
     ],
     note:'Verbosity 1 = all txids without transaction details. Verbosity 2 = full detail of every transaction (very large output). Verbosity 0 = raw hex block.'},
    {id:'verifychain',code:'bitcoin-cli verifychain 3 6',hint:'Verify chain integrity',
     output:[['true','s162-tbt']],
     fields:[
       {k:'param 1: checklevel',v:'3',d:'0=read block, 1=undo data, 2=validate, 3=disconnect & reconnect tip, 4=reconnect all blocks.'},
       {k:'param 2: nblocks',v:'6',d:'The number of blocks checked from the tip backwards. A value of 0 = check all (very slow).'},
       {k:'output: true',v:'true',d:'All checks pass. false means the database is corrupt and needs a reindex.'},
     ],
     note:'Useful after a crash or sudden shutdown to ensure the node’s database isn’t corrupt. Checklevel 3 with 6 blocks is a good balance between speed and accuracy.'},
  ];

  let currentCmd=CMDS[0].id;

  function runRPC(cmdId){
    currentCmd=cmdId;
    document.querySelectorAll('.b16-s162-cmd').forEach(b=>{
      b.classList.toggle('s162-act', b.dataset.id===cmdId);
    });
    const data=CMDS.find(c=>c.id===cmdId);if(!data) return;

    const body=g('b16-s162-term-body');if(!body) return;
    body.innerHTML='';
    const prompt=document.createElement('div');
    prompt.innerHTML=`<span class="s162-tgreen">satoshi@node</span><span class="s162-tgray">:~$</span> <span class="s162-twhite"> ${data.code}</span>`;
    body.appendChild(prompt);

    let buf=[];
    const flush=()=>{
      if(!buf.length) return;
      const d=document.createElement('div');
      buf.forEach(([txt,cls])=>{const s=document.createElement('span');s.className=cls;s.textContent=txt;d.appendChild(s);});
      body.appendChild(d);buf=[];
    };
    data.output.forEach(([txt,cls])=>{
      buf.push([txt,cls]);
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||cls==='s162-tcm'||t.endsWith(',')) flush();
    });
    flush();

    const fe=g('b16-s162-fe'),fei=g('b16-s162-fe-inner');
    if(fe&&fei){
      fe.style.display='flex';fei.innerHTML='';
      data.fields.forEach(f=>{
        const row=document.createElement('div');row.className='b16-s162-field';
        row.innerHTML=`<div class="b16-s162-fk">${f.k}</div><div class="b16-s162-fv">${f.v}</div><div class="b16-s162-fd">${f.d}</div>`;
        fei.appendChild(row);
      });
    }
    const note=g('b16-s162-note');
    if(note){note.style.display='block';note.textContent=data.note;}
  }

  // Build command buttons
  (function(){
    const el=g('b16-s162-cmds');if(!el) return;
    CMDS.forEach((c,i)=>{
      const btn=document.createElement('div');
      btn.className='b16-s162-cmd'+(i===0?' s162-act':'');
      btn.dataset.id=c.id;
      btn.innerHTML=`<div class="b16-s162-cmd-code">${c.code}</div><div class="b16-s162-cmd-hint">${c.hint}</div><div class="b16-s162-cmd-arrow">▶</div>`;
      btn.addEventListener('click',()=>runRPC(c.id));
      el.appendChild(btn);
    });
  })();

  // Tabs
  const t1=g('b16-s162-t1'),t2=g('b16-s162-t2');
  const p1=g('b16-s162-p1'),p2=g('b16-s162-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b16-s162-tab s162-act';t2.className='b16-s162-tab';
    p1.className='b16-s162-pane show';p2.className='b16-s162-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b16-s162-tab s162-act';t1.className='b16-s162-tab';
    p2.className='b16-s162-pane show';p1.className='b16-s162-pane';
    runRPC(currentCmd);
  });

  // Init
  runRPC('getblockcount');
})();

// ============================================================
// PAGE 19 · BAB 16 · 16.1 SIMULATION (RPC Terminal IBD)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  let currentCmd='getblockchaininfo';

  const OUTPUTS={
    getblockchaininfo:{
      cmd:'bitcoin-cli getblockchaininfo',
      lines:[
        ['{','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "bestblockhash"','jkey'],[': ','jpunc'],['"00000000000000000001a4b..."','jstr'],[',','jpunc'],
        ['  "difficulty"','jkey'],[': ','jpunc'],['88171509232073.27','jnum'],[',','jpunc'],
        ['  "time"','jkey'],[': ','jpunc'],['1717459200','jnum'],[',','jpunc'],
        ['  "mediantime"','jkey'],[': ','jpunc'],['1717456800','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['0.9999982341','jnum'],[',','jpunc'],
        ['  "chainwork"','jkey'],[': ','jpunc'],['"00000000000000000000000000000000000000007b4e..."','jstr'],[',','jpunc'],
        ['  "pruned"','jkey'],[': ','jpunc'],['false','jbfalse'],[',','jpunc'],
        ['  "initialblockdownload"','jkey'],[': ','jpunc'],['false','jbfalse'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"chain"',val:'"main"',desc:'The network being run: main (mainnet), test (testnet), signet, or regtest.',hl:false},
        {key:'"blocks"',val:'870142',desc:'The number of fully validated blocks. If equal to "headers", the node is synced.',hl:true},
        {key:'"headers"',val:'870142',desc:'The number of known block headers. Larger than "blocks" while still in IBD.',hl:true},
        {key:'"verificationprogress"',val:'0.9999982341',desc:'Sync progress from 0 to 1. A value of 1.0 means the node is fully synced with the latest chain.',hl:true},
        {key:'"initialblockdownload"',val:'false',desc:'true = still in IBD, not yet reliable. false = synced and ready to use.',hl:true},
        {key:'"difficulty"',val:'88171509232073',desc:'The current mining difficulty. The higher it is, the more hashes are needed per block.',hl:false},
        {key:'"mediantime"',val:'1717456800',desc:'The Median Time Past (MTP) of the last 11 blocks. Used by the protocol to validate timelocks.',hl:false},
        {key:'"chainwork"',val:'"00000...7b4e"',desc:'The total accumulated proof-of-work in hex format. This determines which chain is the heaviest.',hl:false},
        {key:'"pruned"',val:'false',desc:'true = pruning mode active (old blocks deleted). false = a full archival node.',hl:false},
      ],
      note:'This command is the fastest way to check whether the node is synced. If "initialblockdownload" is still true, don’t use this node to verify payments.',
    },
    getinfo:{
      cmd:'bitcoin-cli -getinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "headers"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['  "verificationprogress"','jkey'],[': ','jpunc'],['"99.9998%"','jstr'],[',','jpunc'],
        ['  "timeoffset"','jkey'],[': ','jpunc'],['0','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['{','jpunc'],
        ['    "in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['    "out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['    "total"','jkey'],[': ','jpunc'],['18','jnum'],
        ['  }','jpunc'],[',','jpunc'],
        ['  "chain"','jkey'],[': ','jpunc'],['"main"','jstr'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"version"',val:'270000',desc:'The client software version running. 270000 = version 27.0.0.',hl:false},
        {key:'"blocks"',val:'870142',desc:'The last validated block.',hl:true},
        {key:'"verificationprogress"',val:'"99.9998%"',desc:'Sync progress in an easy-to-read percentage format.',hl:true},
        {key:'"connections"',val:'{in:8, out:10}',desc:'The number of inbound and outbound connections. At least 8 outbound for optimal security.',hl:true},
        {key:'"timeoffset"',val:'0',desc:'The time difference between the node’s clock and network time. Ideally 0 or very small.',hl:false},
        {key:'"relayfee"',val:'0.00001000',desc:'The minimum fee rate this node will relay (in BTC/kB). Transactions below this won’t be forwarded.',hl:false},
      ],
      note:'The -getinfo flag (with a leading minus) gives a shorter, easier-to-read summary. No wallet connection is needed for this command.',
    },
    getpeerinfo_sync:{
      cmd:'bitcoin-cli getpeerinfo | grep -E \'"addr"|"synced_blocks"\'',
      lines:[
        ['# Peer 1','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"203.0.113.42:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 2','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"198.51.100.17:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870140','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 3 (Tor)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"mj3urq...onion:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['870142','jnum'],[',','jpunc'],
        ['','jpunc'],
        ['# Peer 4 (lagging)','jcomment'],
        ['  "addr"','jkey'],[': ','jpunc'],['"192.0.2.88:8333"','jstr'],[',','jpunc'],
        ['  "synced_blocks"','jkey'],[': ','jpunc'],['869998','jnum'],
      ],
      fields:[
        {key:'"addr"',val:'"203.0.113.42:8333"',desc:'The peer’s IP address and port. Port 8333 is the default Bitcoin mainnet port. An .onion address means the peer is connected via Tor.',hl:false},
        {key:'"synced_blocks"',val:'870142',desc:'The last block this peer is known to have validated. If equal to your node’s blocks, this peer is also fully synced.',hl:true},
        {key:'Peer with 869998',val:'144 blocks behind',desc:'The client node automatically prioritizes downloading from more up-to-date peers. A peer far behind is deprioritized.',hl:true},
      ],
      note:'During IBD, the client software downloads blocks in parallel from many peers at once. This command is useful to ensure you’re connected to synced peers.',
    },
    getnetworkinfo:{
      cmd:'bitcoin-cli getnetworkinfo',
      lines:[
        ['{','jpunc'],
        ['  "version"','jkey'],[': ','jpunc'],['270000','jnum'],[',','jpunc'],
        ['  "subversion"','jkey'],[': ','jpunc'],['"\/Satoshi:27.0.0\/"','jstr'],[',','jpunc'],
        ['  "protocolversion"','jkey'],[': ','jpunc'],['70016','jnum'],[',','jpunc'],
        ['  "connections"','jkey'],[': ','jpunc'],['18','jnum'],[',','jpunc'],
        ['  "connections_in"','jkey'],[': ','jpunc'],['8','jnum'],[',','jpunc'],
        ['  "connections_out"','jkey'],[': ','jpunc'],['10','jnum'],[',','jpunc'],
        ['  "networkactive"','jkey'],[': ','jpunc'],['true','jbtrue'],[',','jpunc'],
        ['  "relayfee"','jkey'],[': ','jpunc'],['0.00001000','jnum'],[',','jpunc'],
        ['  "localaddresses"','jkey'],[': ','jpunc'],['[','jpunc'],
        ['    { "address": "203.0.113.100", "port": 8333, "score": 4 }','jpunc'],
        ['  ]','jpunc'],
        ['}','jpunc'],
      ],
      fields:[
        {key:'"subversion"',val:'"/Satoshi:27.0.0/"',desc:'The user agent sent to other peers during the handshake. This is what other peers see as your software’s "identity".',hl:false},
        {key:'"protocolversion"',val:'70016',desc:'The Bitcoin P2P protocol version. Determines which features can be communicated between nodes.',hl:true},
        {key:'"connections_in"',val:'8',desc:'Peers actively connected to your node. Only possible if port 8333 is open and reachable from the internet.',hl:true},
        {key:'"connections_out"',val:'10',desc:'Peers your node connects to. Outbound connections are safer because you choose the peers.',hl:true},
        {key:'"networkactive"',val:'true',desc:'false means the node is in offline mode — not receiving or sending data to any peer.',hl:false},
        {key:'"localaddresses"',val:'"203.0.113.100:8333"',desc:'The public IP address advertised to the network. If empty, the node can’t accept inbound connections.',hl:false},
      ],
      note:'A node with connections_in > 0 is reachable from the internet and helps the network as a relay. A node with only outbound connections can still verify transactions safely.',
    },
  };

  function renderTerminal(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const body=g('b16-s161-body');if(!body) return;
    body.innerHTML='';

    // Prompt
    const prompt=document.createElement('div');
    prompt.className='b16-s161-prompt';
    prompt.innerHTML=`<span class="b16-s161-prompt-user">satoshi@node</span>:~$ <span class="b16-s161-cmd-line">${data.cmd}</span>`;
    body.appendChild(prompt);

    // JSON output
    const out=document.createElement('div');
    out.className='b16-s161-output';

    // Group tokens into lines
    let lineTokens=[];
    const flushLine=()=>{
      if(!lineTokens.length) return;
      const lineEl=document.createElement('div');
      lineEl.className='b16-s161-json-line';
      lineTokens.forEach(([txt,cls])=>{
        const span=document.createElement('span');
        span.className=`b16-s161-${cls}`;
        span.textContent=txt;
        lineEl.appendChild(span);
      });
      out.appendChild(lineEl);
      lineTokens=[];
    };

    data.lines.forEach(([txt,cls])=>{
      if(txt===''&&cls==='jpunc'){flushLine();out.appendChild(document.createElement('br'));return;}
      lineTokens.push([txt,cls]);
      // End line after: standalone { } [ ] , or comment
      const t=txt.trim();
      if(t===','||t==='{'||t==='}'||t==='['||t===']'||cls==='jcomment'){flushLine();}
    });
    flushLine();
    body.appendChild(out);
  }

  function renderExplain(cmdKey){
    const data=OUTPUTS[cmdKey];if(!data) return;
    const el=g('b16-s161-explain');
    const fields=g('b16-s161-fields');
    const note=g('b16-s161-note');
    if(el) el.style.display='flex';
    if(note){note.style.display='block';note.textContent=data.note;}
    if(!fields) return;
    fields.innerHTML='';
    data.fields.forEach(f=>{
      const row=document.createElement('div');
      row.className='b16-s161-field'+(f.hl?' s161-hl':'');
      row.innerHTML=`
        <div class="b16-s161-field-key">${f.key}</div>
        <div class="b16-s161-field-desc">${f.desc}</div>
        <div class="b16-s161-field-val">${f.val}</div>`;
      fields.appendChild(row);
    });
  }

  function run(){
    renderTerminal(currentCmd);
    renderExplain(currentCmd);
  }

  // Command buttons
  document.querySelectorAll('.b16-s161-cmd-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.b16-s161-cmd-btn').forEach(b=>b.classList.remove('s161-act'));
      btn.classList.add('s161-act');
      currentCmd=btn.dataset.cmd;
    });
  });

  const runBtn=g('b16-s161-run');
  if(runBtn) runBtn.addEventListener('click',run);

  // Init
  run();
})();

