// ============================================================
// PAGE 13 · BAB 10 · NAVIGATION
// ============================================================
function showSectionInContentB10(sectionId, sbId) {
  document.querySelectorAll('#page-bab10 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab10 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab10-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 13 · BAB 10 · TOPBAR
// ============================================================
document.getElementById('back-home-b10').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b10').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 13 · BAB 10 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab10').addEventListener('click', () => navigate('page-bab10'));

// ============================================================
// PAGE 13 · BAB 10 · SIDEBAR EVENTS (10.1 - 10.6)
// ============================================================
document.getElementById('sb-10-1').addEventListener('click', () => showSectionInContentB10('section-10-1', 'sb-10-1'));
document.getElementById('sb-10-2').addEventListener('click', () => showSectionInContentB10('section-10-2', 'sb-10-2'));
document.getElementById('sb-10-3').addEventListener('click', () => showSectionInContentB10('section-10-3', 'sb-10-3'));
document.getElementById('sb-10-4').addEventListener('click', () => showSectionInContentB10('section-10-4', 'sb-10-4'));
document.getElementById('sb-10-5').addEventListener('click', () => showSectionInContentB10('section-10-5', 'sb-10-5'));
document.getElementById('sb-10-6').addEventListener('click', () => showSectionInContentB10('section-10-6', 'sb-10-6'));

// ============================================================
// PAGE 13 · BAB 10 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab10 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB10(target, sb);
  });
});

// ============================================================
// PAGE 13 · BAB 10 · 10.6 SIMULATION (Node Types)
// ============================================================
(function() {
  const ids = ['b10-s106-c1', 'b10-s106-c2', 'b10-s106-c3'];
  ids.forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('click', () => {
      const isActive = el.classList.contains('active');
      ids.forEach(cid => {
        const c = document.getElementById(cid); if (c) c.classList.remove('active');
      });
      if (!isActive) el.classList.add('active');
    });
  });
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.5 SIMULATION (UTXO Privacy)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const NODES=[
    {id:'A',label:'UTXO A\n0.800 BTC',x:0.12,y:0.20},
    {id:'B',label:'UTXO B\n0.450 BTC',x:0.12,y:0.65},
    {id:'C',label:'UTXO C\n1.200 BTC',x:0.72,y:0.20},
    {id:'D',label:'UTXO D\n0.300 BTC',x:0.72,y:0.65},
  ];

  let graphW=0, graphH=0, sent=false;

  function getPos(n){return {x:n.x*graphW, y:n.y*graphH};}

  function initGraph(){
    const gr=g('b10-s105-graph'); if(!gr) return;
    graphW=gr.getBoundingClientRect().width||300;
    graphH=gr.getBoundingClientRect().height||220;
    gr.querySelectorAll('.b10-s105-node').forEach(el=>el.remove());
    const svg=g('b10-s105-svg'); if(svg) svg.innerHTML='';
    NODES.forEach(n=>{
      const el=document.createElement('div');
      el.className='b10-s105-node';
      el.id='b10n-'+n.id;
      const pos=getPos(n);
      el.style.left=(pos.x-22)+'px';
      el.style.top=(pos.y-22)+'px';
      el.innerHTML=`<div class="b10-s105-node-circle unknown" id="b10nc-${n.id}">${n.id}</div>
        <div class="b10-s105-node-label">${n.label.replace('\n','<br>')}</div>`;
      gr.appendChild(el);
    });
  }

  function drawSVGLine(x1,y1,x2,y2,color,dashed){
    const svg=g('b10-s105-svg'); if(!svg) return;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke',color);line.setAttribute('stroke-width','1.5');
    if(dashed) line.setAttribute('stroke-dasharray','4,3');
    svg.appendChild(line);
  }

  function addTxNode(x,y){
    const gr=g('b10-s105-graph'); if(!gr) return;
    const el=document.createElement('div');
    el.className='b10-s105-node'; el.id='b10n-TX';
    el.style.left=(x-22)+'px'; el.style.top=(y-22)+'px';
    el.innerHTML=`<div class="b10-s105-node-circle tx-node">TX</div><div class="b10-s105-node-label">transaksi</div>`;
    gr.appendChild(el);
  }

  const sendBtn=g('b10-s105-send');
  if(sendBtn) sendBtn.addEventListener('click',async()=>{
    if(sent) return;
    sent=true; sendBtn.disabled=true;
    const note=g('b10-s105-note1');
    if(note){note.textContent='Transaksi dikirim! UTXO A dan B digunakan sebagai input bersama...';note.className='b10-s105-note s105-info';}

    const txX=graphW*0.42, txY=graphH*0.42;
    const pA=getPos(NODES[0]), pB=getPos(NODES[1]);
    const pC=getPos(NODES[2]), pD=getPos(NODES[3]);

    drawSVGLine(pA.x,pA.y,txX,txY,'rgba(83,74,183,0.6)',false);
    drawSVGLine(pB.x,pB.y,txX,txY,'rgba(83,74,183,0.6)',false);
    addTxNode(txX,txY);
    await wait(700);

    drawSVGLine(txX,txY,pC.x,pC.y,'rgba(83,74,183,0.3)',true);
    drawSVGLine(txX,txY,pD.x,pD.y,'rgba(83,74,183,0.3)',true);
    await wait(500);

    ['A','B'].forEach(id=>{
      const c=g('b10nc-'+id);
      if(c) c.className='b10-s105-node-circle linked';
    });
    await wait(400);

    const svg=g('b10-s105-svg');
    if(svg){
      const link=document.createElementNS('http://www.w3.org/2000/svg','line');
      link.setAttribute('x1',pA.x);link.setAttribute('y1',pA.y);
      link.setAttribute('x2',pB.x);link.setAttribute('y2',pB.y);
      link.setAttribute('stroke','rgba(163,45,45,0.6)');
      link.setAttribute('stroke-width','2');
      link.setAttribute('stroke-dasharray','3,2');
      svg.appendChild(link);
    }

    if(note){
      note.textContent='Analis mendeteksi: UTXO A dan B digunakan bersama sebagai input. Heuristik common input ownership: keduanya kemungkinan besar milik orang yang sama. Analis menandai keduanya sebagai satu entitas.';
      note.className='b10-s105-note s105-warn';
    }
  });

  const rst1=g('b10-s105-rst1');
  if(rst1) rst1.addEventListener('click',()=>{
    sent=false; initGraph();
    if(sendBtn) sendBtn.disabled=false;
    const note=g('b10-s105-note1');
    if(note){note.textContent='UTXO A dan B belum diketahui hubungannya. Begitu digunakan bersama dalam satu transaksi, analis blockchain akan langsung menghubungkan keduanya.';note.className='b10-s105-note s105-idle';}
  });

  const t1=g('b10-s105-t1'),t2=g('b10-s105-t2');
  const p1=g('b10-s105-p1'),p2=g('b10-s105-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b10-s105-tab s105-act'; t2.className='b10-s105-tab';
    p1.className='b10-s105-pane show'; p2.className='b10-s105-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b10-s105-tab s105-act'; t1.className='b10-s105-tab';
    p2.className='b10-s105-pane show'; p1.className='b10-s105-pane';
  });

  initGraph();
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>{if(!sent) initGraph();})).observe(g('b10-s105-graph')||document.body);
  }
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.4 SIMULATION (UTXO Consolidation)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const INIT=[
    {id:'L1',val:4.500,cls:'large'},{id:'L2',val:2.100,cls:'large'},{id:'L3',val:1.800,cls:'large'},
    {id:'M1',val:0.450,cls:'medium'},{id:'M2',val:0.280,cls:'medium'},{id:'M3',val:0.150,cls:'medium'},
    {id:'M4',val:0.095,cls:'medium'},{id:'M5',val:0.070,cls:'medium'},
    {id:'S1',val:0.008,cls:'small'},{id:'S2',val:0.005,cls:'small'},
    {id:'S3',val:0.003,cls:'small'},{id:'S4',val:0.002,cls:'small'},
    {id:'S5',val:0.001,cls:'small'},{id:'S6',val:0.001,cls:'small'},
    {id:'D1',val:0.000005,cls:'dust'},{id:'D2',val:0.000004,cls:'dust'},
    {id:'D3',val:0.000003,cls:'dust'},{id:'D4',val:0.000002,cls:'dust'},
    {id:'D5',val:0.000002,cls:'dust'},{id:'D6',val:0.000001,cls:'dust'},
  ];

  const CHART=[
    {label:'2020',val:55},{label:'2021',val:78},{label:'2022',val:85},
    {label:'2023',val:120},{label:'2024',val:180},{label:'Skrg',val:180,current:true},
  ];

  let utxos=[...INIT.map(u=>({...u}))];
  let busy=false;

  function totalBTC(list){return list.reduce((s,u)=>s+u.val,0);}
  function dustCount(list){return list.filter(u=>u.cls==='dust').length;}

  function renderSet(){
    const el=g('b10-s104-set'); if(!el) return;
    el.innerHTML=utxos.map(u=>`
      <div class="b10-s104-utxo ${u.cls}${u.consolidating?' consolidating':''}${u.merged?' merged':''}" title="${u.val} BTC">
        ${u.cls==='large'?u.val.toFixed(2):u.cls==='medium'?u.val.toFixed(3):''}
      </div>`).join('');
  }

  function updateStats(){
    const cnt=g('b10-s104-count'); if(cnt) cnt.textContent=`${utxos.length} UTXO`;
    const tot=g('b10-s104-total'); if(tot) tot.textContent=`Total: ${totalBTC(utxos).toFixed(3)} BTC`;
    const dst=g('b10-s104-dust');  if(dst) dst.textContent=`Dust: ${dustCount(utxos)} UTXO`;
  }

  function renderChart(highlight){
    const el=g('b10-s104-bars'); if(!el) return;
    const max=Math.max(...CHART.map(d=>d.val));
    el.innerHTML=CHART.map((d,i)=>{
      const isLast=i===CHART.length-1;
      const h=Math.round((d.val/max)*100);
      const bg=highlight&&isLast?'#0F6E56':d.current?'#534AB7':'rgba(83,74,183,0.3)';
      const lbl=isLast?(highlight?utxos.length+'':d.val+''):d.val+'k';
      return `<div class="b10-s104-bar-col">
        <div style="font-size:8px;color:#3A3A35;font-family:'Courier Prime',monospace;text-align:center;">${lbl}</div>
        <div class="b10-s104-bar-fill" style="height:${h}%;background:${bg};"></div>
        <div class="b10-s104-bar-label">${d.label}</div>
      </div>`;
    }).join('');
  }

  async function consolidate(){
    busy=true;
    const btn=g('b10-s104-consolidate'); if(btn) btn.disabled=true;
    const note=g('b10-s104-note');
    if(note){note.textContent='Memilih UTXO kecil dan dust untuk dikonsolidasi...';note.className='b10-s104-note s104-run';}

    const toConsolidate=utxos.filter(u=>u.cls==='small'||u.cls==='dust');
    toConsolidate.forEach(u=>u.consolidating=true);
    renderSet(); await wait(800);

    const mergedVal=toConsolidate.reduce((s,u)=>s+u.val,0);
    const fee=0.00015;
    const netVal=Math.max(0,mergedVal-fee);

    if(note) note.textContent=`Menggabungkan ${toConsolidate.length} UTXO menjadi 1 UTXO baru...`;
    await wait(700);

    utxos=utxos.filter(u=>u.cls!=='small'&&u.cls!=='dust');
    utxos.push({id:'MERGED',val:netVal,cls:'medium',merged:true});
    renderSet(); updateStats(); renderChart(true);

    if(note){
      note.textContent=`Konsolidasi selesai! ${toConsolidate.length} UTXO digabung menjadi 1 UTXO (${netVal.toFixed(5)} BTC, setelah fee ${fee} BTC). UTXO set berkurang dari 20 menjadi ${utxos.length}.`;
      note.className='b10-s104-note s104-done';
    }
    busy=false;
  }

  const cb=g('b10-s104-consolidate'); if(cb) cb.addEventListener('click',()=>{if(!busy) consolidate();});
  const rb=g('b10-s104-reset');
  if(rb) rb.addEventListener('click',()=>{
    if(busy) return;
    utxos=[...INIT.map(u=>({...u}))];
    renderSet(); updateStats(); renderChart(false);
    const btn=g('b10-s104-consolidate'); if(btn) btn.disabled=false;
    const note=g('b10-s104-note');
    if(note){note.textContent='UTXO kecil dan dust menambah beban pada setiap full node. Klik "Konsolidasi UTXO Kecil" untuk menggabungkan UTXO kecil menjadi satu saat fee sedang rendah.';note.className='b10-s104-note s104-idle';}
  });

  renderSet(); updateStats(); renderChart(false);
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.3 SIMULATION (TX Verification)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  const STEPS1=[
    {label:'Cek UTXO #1 di set',sub:'u_A1 (1.500 BTC) — ada di UTXO set?',inpId:'b10-s103-inp1a',
     passMsg:'u_A1 ditemukan di UTXO set. Ada dan belum dihabiskan.'},
    {label:'Cek UTXO #2 di set',sub:'u_B1 (0.750 BTC) — ada di UTXO set?',inpId:'b10-s103-inp1b',
     passMsg:'u_B1 ditemukan di UTXO set. Ada dan belum dihabiskan.'},
    {label:'Verifikasi nilai',sub:'Total input (2.250) >= total output + fee (2.250)?',inpId:null,
     passMsg:'Input 2.250 BTC = Output 2.235 BTC + Fee 0.015 BTC. Nilai balance.'},
    {label:'Verifikasi script',sub:'Script unlocking memenuhi script locking u_A1 dan u_B1?',inpId:null,
     passMsg:'Tanda tangan kriptografis valid. Alice berhak membelanjakan kedua UTXO ini.'},
  ];

  const STEPS2=[
    {label:'Cek UTXO #1 di set',sub:'u_A1 (1.500 BTC) — ada di UTXO set?',inpId:'b10-s103-inp2a',
     failMsg:'u_A1 TIDAK ada di UTXO set. Sudah dikonsumsi oleh tx_f1a2b3c4. Double spend terdeteksi!'},
  ];

  function makeSteps(steps, prefix){
    return steps.map((s,i)=>`
      <div class="b10-s103-step s103-idle" id="${prefix}-${i}">
        <div class="b10-s103-step-icon">${i+1}</div>
        <div class="b10-s103-step-text">${s.label}<div class="b10-s103-step-sub">${s.sub}</div></div>
      </div>`).join('');
  }

  function initP1(){
    const st=g('b10-s103-steps1'); if(st) st.innerHTML=makeSteps(STEPS1,'b10-s103-s1');
    ['b10-s103-inp1a','b10-s103-inp1b'].forEach(id=>{const el=g(id);if(el) el.className='b10-s103-tx-item s103-inp';});
    const b=g('b10-s103-badge1'); if(b){b.textContent='menunggu verifikasi';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note1'); if(n){n.textContent='Klik "Verifikasi Transaksi" untuk melihat bagaimana node memeriksa transaksi ini step by step menggunakan UTXO set.';n.className='b10-s103-note s103-idle';}
    const rb=g('b10-s103-run1'); if(rb) rb.disabled=false;
  }

  function initP2(){
    const st=g('b10-s103-steps2'); if(st) st.innerHTML=makeSteps(STEPS2,'b10-s103-s2');
    ['b10-s103-inp2a','b10-s103-inp2b'].forEach(id=>{const el=g(id);if(el) el.className='b10-s103-tx-item s103-inp';});
    const b=g('b10-s103-badge2'); if(b){b.textContent='menunggu verifikasi';b.className='b10-s103-tx-badge s103-pending';}
    const n=g('b10-s103-note2'); if(n){n.textContent='Klik "Verifikasi Transaksi" untuk melihat bagaimana node mendeteksi double spend saat u_A1 sudah tidak ada di UTXO set.';n.className='b10-s103-note s103-idle';}
    const rb=g('b10-s103-run2'); if(rb) rb.disabled=false;
  }

  let busy1=false, busy2=false;

  async function runP1(){
    busy1=true;
    const rb=g('b10-s103-run1'); if(rb) rb.disabled=true;
    const note=g('b10-s103-note1');
    for(let i=0;i<STEPS1.length;i++){
      const s=STEPS1[i];
      const el=g(`b10-s103-s1-${i}`); if(!el) continue;
      el.className='b10-s103-step s103-active';
      el.querySelector('.b10-s103-step-icon').textContent=i+1;
      if(note){note.textContent=`Memeriksa: ${s.label}...`;note.className='b10-s103-note s103-run';}
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-checking';}
      await wait(700);
      el.className='b10-s103-step s103-pass';
      el.querySelector('.b10-s103-step-icon').textContent='✓';
      if(s.inpId){const inp=g(s.inpId);if(inp) inp.className='b10-s103-tx-item s103-inp-ok';}
      if(note){note.textContent=s.passMsg;note.className='b10-s103-note s103-run';}
      await wait(600);
    }
    const b=g('b10-s103-badge1'); if(b){b.textContent='transaksi valid';b.className='b10-s103-tx-badge s103-valid';}
    if(note){note.textContent='Semua pemeriksaan lulus! Transaksi diterima ke mempool dan akan diteruskan ke peer lain.';note.className='b10-s103-note s103-pass';}
    busy1=false;
  }

  async function runP2(){
    busy2=true;
    const rb=g('b10-s103-run2'); if(rb) rb.disabled=true;
    const note=g('b10-s103-note2');
    const s=STEPS2[0];
    const el=g('b10-s103-s2-0'); if(!el) return;
    el.className='b10-s103-step s103-active';
    if(note){note.textContent=`Memeriksa: ${s.label}...`;note.className='b10-s103-note s103-run';}
    const inp=g(s.inpId); if(inp) inp.className='b10-s103-tx-item s103-inp-checking';
    await wait(800);
    el.className='b10-s103-step s103-fail';
    el.querySelector('.b10-s103-step-icon').textContent='✗';
    if(inp) inp.className='b10-s103-tx-item s103-inp-fail';
    const b=g('b10-s103-badge2'); if(b){b.textContent='ditolak';b.className='b10-s103-tx-badge s103-invalid';}
    if(note){note.textContent=s.failMsg;note.className='b10-s103-note s103-fail';}
    busy2=false;
  }

  const r1=g('b10-s103-run1'); if(r1) r1.addEventListener('click',()=>{if(!busy1) runP1();});
  const r2=g('b10-s103-run2'); if(r2) r2.addEventListener('click',()=>{if(!busy2) runP2();});
  const rst1=g('b10-s103-rst1'); if(rst1) rst1.addEventListener('click',()=>{if(!busy1) initP1();});
  const rst2=g('b10-s103-rst2'); if(rst2) rst2.addEventListener('click',()=>{if(!busy2) initP2();});

  const t1=g('b10-s103-t1'), t2=g('b10-s103-t2');
  const p1=g('b10-s103-p1'), p2=g('b10-s103-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b10-s103-tab s103-act'; t2.className='b10-s103-tab';
    p1.className='b10-s103-pane show'; p2.className='b10-s103-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b10-s103-tab s103-act'; t1.className='b10-s103-tab';
    p2.className='b10-s103-pane show'; p1.className='b10-s103-pane';
  });

  initP1(); initP2();
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.2 SIMULATION (UTXO Set Update)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const INIT=[
    {id:'u_A1',val:'2.100',key:'A1'},{id:'u_A2',val:'0.800',key:'A2'},
    {id:'u_B1',val:'1.500',key:'B1'},{id:'u_C1',val:'0.650',key:'C1'},
    {id:'u_C2',val:'0.300',key:'C2'},{id:'u_D1',val:'0.900',key:'D1'},
    {id:'u_E1',val:'0.450',key:'E1'},{id:'u_F1',val:'0.750',key:'F1'},
    {id:'u_G1',val:'0.200',key:'G1'},{id:'u_H1',val:'0.350',key:'H1'},
    {id:'u_I1',val:'0.600',key:'I1'},{id:'u_J1',val:'0.400',key:'J1'},
  ];

  const TXS=[
    {id:'cb_840512',label:'Coinbase',type:'coinbase',rm:[],
     add:[{id:'u_CB',val:'3.252',key:'CB',cls:'cb-u'}],ops:'-0 +1',
     desc:'Coinbase: miner mendapat 3.125 BTC reward + 0.127 BTC total fee dari semua transaksi.'},
    {id:'tx_f1a2b3',label:'Tx #1',type:'normal',rm:['A1','A2'],
     add:[{id:'u_X1',val:'2.700',key:'X1',cls:'new-u'},{id:'u_X2',val:'0.185',key:'X2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #1: u_A1 + u_A2 dikonsumsi (2.900 BTC). Dibuat u_X1 (2.700) + u_X2 (0.185). Fee: 0.015 BTC.'},
    {id:'tx_c4d5e6',label:'Tx #2',type:'normal',rm:['B1','C1'],
     add:[{id:'u_Y1',val:'2.100',key:'Y1',cls:'new-u'},{id:'u_Y2',val:'0.035',key:'Y2',cls:'new-u'}],ops:'-2 +2',
     desc:'Tx #2: u_B1 + u_C1 dikonsumsi (2.150 BTC). Dibuat u_Y1 (2.100) + u_Y2 (0.035). Fee: 0.015 BTC.'},
    {id:'tx_g7h8i9',label:'Tx #3',type:'normal',rm:['D1'],
     add:[{id:'u_Z1',val:'0.870',key:'Z1',cls:'new-u'}],ops:'-1 +1',
     desc:'Tx #3: u_D1 dikonsumsi (0.900 BTC). Dibuat u_Z1 (0.870 BTC). Fee: 0.030 BTC.'},
  ];

  let utxos=[...INIT.map(u=>({...u,cls:'alive'}))];
  let logs=[], busy=false, doneCount=0, activeIdx=-1;

  function renderBlock(){
    const el=g('b10-s102-blk'); if(!el) return;
    el.innerHTML=TXS.map((tx,i)=>{
      const state=i<doneCount?'done':i===activeIdx?'active':'idle';
      const badge=i<doneCount?'done':tx.type==='coinbase'?'coinbase':'normal';
      const bTxt=i<doneCount?'selesai':tx.type==='coinbase'?'coinbase':'normal';
      return `<div class="b10-s102-tx ${state}">
        <span class="b10-s102-tx-badge ${badge}">${bTxt}</span>
        <span class="b10-s102-tx-id">${tx.id}</span>
        <span class="b10-s102-tx-ops">${tx.ops}</span>
      </div>`;
    }).join('');
  }

  function renderSet(){
    const el=g('b10-s102-set'); if(!el) return;
    el.innerHTML=utxos.map(u=>`
      <div class="b10-s102-utxo ${u.cls}">${u.id}<br><span style="font-size:9px;opacity:.7;">${u.val} BTC</span></div>`
    ).join('');
  }

  function renderLog(){
    const el=g('b10-s102-log'); if(!el) return;
    el.innerHTML=logs.map(l=>`<div class="b10-s102-log-item ${l.cls}">${l.txt}</div>`).join('');
    el.scrollTop=el.scrollHeight;
  }

  function updateStats(rm,add){
    const after=INIT.length-rm+add;
    const delta=add-rm;
    const d=g('b10-s102-dlt'); if(d) d.textContent=`Perubahan: ${delta>=0?'+':''}${delta} UTXO`;
    const a=g('b10-s102-aft'); if(a) a.textContent=`Sesudah: ${after} UTXO`;
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  async function run(){
    busy=true;
    const runBtn=g('b10-s102-run'); if(runBtn) runBtn.disabled=true;
    let totalRm=0, totalAdd=0;
    const note=g('b10-s102-note');

    for(let i=0;i<TXS.length;i++){
      const tx=TXS[i];
      activeIdx=i; renderBlock();
      if(note){note.textContent=tx.desc;note.className='b10-s102-note run-note';}
      await wait(500);

      if(tx.rm.length>0){
        tx.rm.forEach(k=>{const u=utxos.find(u=>u.key===k);if(u) u.cls='removing';});
        renderSet();
        const rmIds=tx.rm.map(k=>INIT.find(u=>u.key===k)?.id||k).join(', ');
        logs.push({cls:'rm',txt:`⊖ Hapus: ${rmIds}`});
        renderLog();
        await wait(700);
      }

      utxos=utxos.filter(u=>!tx.rm.includes(u.key));
      totalRm+=tx.rm.length;
      tx.add.forEach(a=>{utxos.push({...a});totalAdd++;});
      renderSet();
      const logCls=tx.type==='coinbase'?'cb':'add';
      logs.push({cls:logCls,txt:`⊕ Tambah: ${tx.add.map(a=>a.id+' ('+a.val+' BTC)').join(', ')}`});
      renderLog();
      updateStats(totalRm,totalAdd);
      await wait(600);

      doneCount=i+1; activeIdx=-1; renderBlock();
    }

    if(note){
      note.textContent=`Block #840,512 selesai! ${totalRm} UTXO dihapus, ${totalAdd} UTXO ditambah. Total UTXO set: ${utxos.length}.`;
      note.className='b10-s102-note done-note';
    }
    busy=false;
  }

  const runBtn=g('b10-s102-run');
  if(runBtn) runBtn.addEventListener('click',()=>{if(!busy&&doneCount===0) run();});

  const rstBtn=g('b10-s102-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{
    if(busy) return;
    utxos=[...INIT.map(u=>({...u,cls:'alive'}))];
    logs=[]; doneCount=0; activeIdx=-1;
    renderBlock(); renderSet(); renderLog();
    const bef=g('b10-s102-bef'); if(bef) bef.textContent='Sebelum: 12 UTXO';
    const aft=g('b10-s102-aft'); if(aft) aft.textContent='Sesudah: 12 UTXO';
    const dlt=g('b10-s102-dlt'); if(dlt) dlt.textContent='Perubahan: -';
    const rb=g('b10-s102-run'); if(rb) rb.disabled=false;
    const note=g('b10-s102-note');
    if(note){note.textContent='Klik "Proses Block" untuk melihat bagaimana setiap transaksi dalam block memperbarui UTXO set secara berurutan, dimulai dari coinbase transaction.';note.className='b10-s102-note idle-note';}
  });

  renderBlock(); renderSet();
})();

// ============================================================
// PAGE 13 · BAB 10 · 10.1 SIMULATION (UTXO Set)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const INIT=[
    {id:'utxo_a1',val:'1.500',owner:'Alice',   key:'a1'},
    {id:'utxo_a2',val:'0.300',owner:'Alice',   key:'a2'},
    {id:'utxo_b1',val:'0.750',owner:'Bob',     key:'b1'},
    {id:'utxo_c1',val:'0.800',owner:'Carol',   key:'c1'},
    {id:'utxo_d1',val:'0.500',owner:'Dave',    key:'d1'},
    {id:'utxo_e1',val:'0.450',owner:'Eve',     key:'e1'},
    {id:'utxo_f1',val:'0.350',owner:'Frank',   key:'f1'},
    {id:'utxo_g1',val:'0.200',owner:'Grace',   key:'g1'},
  ];
  const NEW_UTXOS=[
    {id:'utxo_b2',val:'1.200',owner:'Bob',             key:'b2',isNew:true},
    {id:'utxo_a3',val:'0.585',owner:'Alice (kembalian)',key:'a3',isNew:true},
  ];

  let utxos=[...INIT], txState='idle';

  function totalBTC(list){return list.reduce((s,u)=>s+parseFloat(u.val),0).toFixed(3);}

  function renderGrid(){
    const grid=g('b10-s101-grid'); if(!grid) return;
    grid.innerHTML='';
    utxos.forEach(u=>{
      const el=document.createElement('div');
      el.className='b10-s101-utxo '+(u.isNew?'new-utxo':'alive');
      el.id='b10-utxo-'+u.key;
      el.innerHTML=`
        <div class="b10-s101-utxo-id">${u.id}</div>
        <div class="b10-s101-utxo-val">${u.val} BTC</div>
        <div class="b10-s101-utxo-owner">${u.owner}</div>
        ${u.isNew?'<div class="b10-s101-utxo-badge new">baru</div>':''}`;
      grid.appendChild(el);
    });
  }

  function updateStats(){
    const cnt=g('b10-s101-count'); if(cnt) cnt.textContent=`UTXO: ${utxos.length} output`;
    const sz=g('b10-s101-size');   if(sz)  sz.textContent=`Total: ${totalBTC(utxos)} BTC`;
  }

  function runTx(){
    txState='animating';
    const sendBtn=g('b10-s101-send'); if(sendBtn) sendBtn.disabled=true;
    const tx=g('b10-s101-tx'); if(tx) tx.style.display='block';
    const note=g('b10-s101-note');
    if(note){note.textContent='Transaksi masuk! Alice menggunakan 2 UTXO-nya sebagai input...';note.className='b10-s101-note active-note';}

    setTimeout(()=>{
      ['a1','a2'].forEach(k=>{
        const el=g('b10-utxo-'+k);
        if(el) el.className='b10-s101-utxo consuming';
      });
      if(note) note.textContent='UTXO input ditandai sebagai consumed — tidak bisa digunakan lagi...';
    },500);

    setTimeout(()=>{
      utxos=utxos.filter(u=>u.key!=='a1'&&u.key!=='a2');
      utxos.push(...NEW_UTXOS);
      renderGrid(); updateStats();
      if(note){note.textContent='UTXO lama dihapus dari set. UTXO baru dibuat: Bob mendapat 1.200 BTC, Alice mendapat kembalian 0.585 BTC.';note.className='b10-s101-note done-note';}
      txState='done';
    },1800);
  }

  const sendBtn=g('b10-s101-send');
  if(sendBtn) sendBtn.addEventListener('click',()=>{if(txState==='idle') runTx();});

  const resetBtn=g('b10-s101-reset');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    txState='idle';
    utxos=[...INIT];
    renderGrid(); updateStats();
    const tx=g('b10-s101-tx'); if(tx) tx.style.display='none';
    const note=g('b10-s101-note');
    if(note){note.textContent='Klik "Kirim Transaksi" untuk melihat bagaimana UTXO dikonsumsi dan UTXO baru dibuat. UTXO set selalu mencerminkan state terkini kepemilikan bitcoin.';note.className='b10-s101-note idle-note';}
    const sb=g('b10-s101-send'); if(sb) sb.disabled=false;
  });

  renderGrid(); updateStats();
})();

