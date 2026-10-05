// ============================================================
// PAGE 21 · BAB 18 · NAVIGATION
// ============================================================
function showSectionInContentB18(sectionId, sbId) {
  document.querySelectorAll('#page-bab18 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab18 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab18-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 21 · BAB 18 · TOPBAR
// ============================================================
document.getElementById('back-home-b18').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b18').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 21 · BAB 18 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab18').addEventListener('click', () => navigate('page-bab18'));

// ============================================================
// PAGE 21 · BAB 18 · SIDEBAR EVENTS (18.1 - 18.6)
// ============================================================
document.getElementById('sb-18-1').addEventListener('click', () => showSectionInContentB18('section-18-1', 'sb-18-1'));
document.getElementById('sb-18-2').addEventListener('click', () => showSectionInContentB18('section-18-2', 'sb-18-2'));
document.getElementById('sb-18-3').addEventListener('click', () => showSectionInContentB18('section-18-3', 'sb-18-3'));
document.getElementById('sb-18-4').addEventListener('click', () => showSectionInContentB18('section-18-4', 'sb-18-4'));
document.getElementById('sb-18-5').addEventListener('click', () => showSectionInContentB18('section-18-5', 'sb-18-5'));
document.getElementById('sb-18-6').addEventListener('click', () => showSectionInContentB18('section-18-6', 'sb-18-6'));

// ============================================================
// PAGE 21 · BAB 18 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab18 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB18(target, sb);
  });
});

// ============================================================
// PAGE 21 · BAB 18 · 18.6 SIMULATION (Dandelion Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  function mkE(tag,attrs){
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  }
  function mkText(svg,x,y,txt,col,sz,bold){
    const t=mkE('text',{x,y,'text-anchor':'middle','dominant-baseline':'central','font-size':sz||8,'font-family':'Sora,sans-serif','fill':col});
    if(bold) t.setAttribute('font-weight','600');
    t.textContent=txt;svg.appendChild(t);
  }
  function mkCircle(svg,x,y,r,fill,stroke,sw){
    svg.appendChild(mkE('circle',{cx:x,cy:y,r,fill,stroke,'stroke-width':sw||'1.5'}));
  }
  function mkLine(svg,x1,y1,x2,y2,col,sw,dash){
    const el=mkE('line',{x1,y1,x2,y2,stroke:col,'stroke-width':sw||'1.5'});
    if(dash) el.setAttribute('stroke-dasharray',dash);
    svg.appendChild(el);
  }
  function mkArrow(svg,x1,y1,x2,y2,col,label){
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),r=13;
    const ax=x1+(dx/len)*r,ay=y1+(dy/len)*r,bx=x2-(dx/len)*r,by=y2-(dy/len)*r;
    mkLine(svg,ax,ay,bx,by,col,'1.5');
    const angle=Math.atan2(by-ay,bx-ax),ah=6;
    svg.appendChild(mkE('polygon',{
      points:`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`,
      fill:col
    }));
    if(label){
      const mx=(ax+bx)/2,my=(ay+by)/2;
      const t=mkE('text',{x:mx,y:my-6,'text-anchor':'middle','font-size':'7','font-family':'Sora,sans-serif','fill':col});
      t.textContent=label;svg.appendChild(t);
    }
  }

  const NODES=[
    {x:110,y:95},{x:55,y:50},{x:165,y:50},
    {x:30,y:100},{x:190,y:100},{x:55,y:150},{x:165,y:150},{x:110,y:170},
  ];
  const LABELS=['KAMU','B','C','D','E','F','G','H'];

  // Flood diagram
  (function(){
    const svg=g('b18-s186-svg-flood');if(!svg) return;
    svg.innerHTML='';
    [1,2,3,4,5,6,7].forEach(i=>{
      mkArrow(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(163,45,45,0.7)','inv');
      mkCircle(svg,NODES[i].x,NODES[i].y,13,'#F4F4F0','rgba(163,45,45,0.4)','1.5');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#A32D2D',7,true);
    });
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#A32D2D','#791F1F','2');
    mkText(svg,NODES[0].x,NODES[0].y-5,'KAMU','#fff',7,true);
    mkText(svg,NODES[0].x,NODES[0].y+6,'(sumber)','#fff',6,false);
    const att=mkE('rect',{x:148,y:152,width:66,height:22,rx:4,fill:'#FCEBEB',stroke:'#A32D2D','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,181,163,'👁 Attacker','#A32D2D',7,true);
    mkLine(svg,165,150,165,152,'rgba(163,45,45,0.5)','1','3,2');
    mkText(svg,110,185,'Sumber langsung terlihat dari node pertama flood','#A32D2D',7,false);
  })();

  // Dandelion diagram
  (function(){
    const svg=g('b18-s186-svg-dan');if(!svg) return;
    svg.innerHTML='';
    const STEM=[0,2,4,6];
    for(let i=0;i<STEM.length-1;i++){
      const a=NODES[STEM[i]],b=NODES[STEM[i+1]];
      const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy),r=13;
      mkLine(svg,a.x,a.y,b.x,b.y,'rgba(15,110,86,0.6)','2');
      const bx=b.x-(dx/len)*r,by=b.y-(dy/len)*r,angle=Math.atan2(dy,dx),ah=6;
      svg.appendChild(mkE('polygon',{
        points:`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`,
        fill:'rgba(15,110,86,0.6)'
      }));
    }
    const sm=mkE('text',{x:158,y:68,'text-anchor':'middle','font-size':'6','font-family':'Sora,sans-serif','fill':'rgba(15,110,86,0.8)'});
    sm.textContent='stem (senyap)';svg.appendChild(sm);
    const FS=NODES[6];
    [1,3,5,7].forEach(i=>{
      mkLine(svg,FS.x,FS.y,NODES[i].x,NODES[i].y,'rgba(133,79,11,0.6)','1','3,2');
      mkCircle(svg,NODES[i].x,NODES[i].y,13,'#FAEEDA','rgba(133,79,11,0.4)','1.5');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#854F0B',7,true);
    });
    STEM.forEach((ni,idx)=>{
      const n=NODES[ni];
      const isFluff=idx===STEM.length-1,isSrc=idx===0;
      mkCircle(svg,n.x,n.y,isSrc?16:13,
        isSrc?'#534AB7':isFluff?'#854F0B':'#EAF3DE',
        isSrc?'#3C3489':isFluff?'#633806':'rgba(15,110,86,0.5)','1.5');
      if(isSrc){mkText(svg,n.x,n.y-5,'KAMU','#fff',7,true);mkText(svg,n.x,n.y+6,'(sumber)','#fff',6,false);}
      else mkText(svg,n.x,n.y,LABELS[ni],isFluff?'#fff':'#0F6E56',7,true);
    });
    const att=mkE('rect',{x:1,y:152,width:64,height:28,rx:4,fill:'#EAF3DE',stroke:'#0F6E56','stroke-width':'0.5'});
    svg.appendChild(att);
    mkText(svg,33,162,'👁 Attacker','#0F6E56',7,true);
    mkText(svg,33,173,'tidak bisa tahu!','#0F6E56',6,false);
    mkText(svg,110,185,'Fluff dari node G — sumber asli tidak terdeteksi','#0F6E56',7,false);
  })();

  // Flow diagram
  (function(){
    const svg=g('b18-s186-flow-svg');if(!svg) return;
    svg.innerHTML='';
    const stemX=[30,100,170,240];
    const labels=[['Kamu','(sumber)'],['Node B'],['Node C'],['Node D']];
    const cols=['#534AB7','#0F6E56','#0F6E56','#854F0B'];
    const bgs=['#EEEDFE','#EAF3DE','#EAF3DE','#FAEEDA'];
    stemX.forEach((x,i)=>{
      mkCircle(svg,x,50,18,bgs[i],cols[i],'1.5');
      labels[i].forEach((l,j)=>mkText(svg,x,45+(j*12),l,cols[i],7,i===0));
      if(i<stemX.length-1){
        const nx=stemX[i+1],col=i<2?'rgba(15,110,86,0.6)':'rgba(133,79,11,0.6)';
        mkLine(svg,x+18,50,nx-18,50,col,'2');
        const mx=(x+nx)/2;
        mkText(svg,mx,36,i<2?'stem':'fluff!',i<2?'#0F6E56':'#854F0B',7,false);
      }
    });
    [[320,20],[350,50],[320,80],[290,80],[270,30]].forEach(([tx,ty])=>{
      mkLine(svg,240,50,tx,ty,'rgba(133,79,11,0.5)','1','3,2');
      mkCircle(svg,tx,ty,10,'#FAEEDA','rgba(133,79,11,0.4)','1');
    });
    mkText(svg,350,95,'fluff phase (flooding normal)','#854F0B',7,false);
    const r=mkE('rect',{x:55,y:78,width:155,height:16,rx:3,fill:'#EAF3DE',stroke:'rgba(15,110,86,0.3)','stroke-width':'0.5'});
    svg.appendChild(r);
    mkText(svg,133,86,'stem phase (senyap, tidak masuk mempool)','#0F6E56',7,false);
  })();

  const t1=g('b18-s186-t1'),t2=g('b18-s186-t2');
  const p1=g('b18-s186-p1'),p2=g('b18-s186-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s186-tab s186-act';t2.className='b18-s186-tab';
    p1.className='b18-s186-pane show';p2.className='b18-s186-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s186-tab s186-act';t1.className='b18-s186-tab';
    p2.className='b18-s186-pane show';p1.className='b18-s186-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.5 SIMULATION (Erlay Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  const NODES=[
    {x:110,y:90},{x:55,y:40},{x:165,y:40},
    {x:30,y:100},{x:190,y:100},{x:55,y:155},{x:165,y:155},
  ];
  const LABELS=['A','B','C','D','E','F','G'];

  function mkCircle(svg,x,y,r,fill,stroke){
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
    c.setAttribute('fill',fill);c.setAttribute('stroke',stroke);c.setAttribute('stroke-width','1.5');
    svg.appendChild(c);
  }
  function mkText(svg,x,y,txt,col,sz,bold){
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',x);t.setAttribute('y',y);
    t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
    t.setAttribute('font-size',sz||8);t.setAttribute('font-family','Sora,sans-serif');
    t.setAttribute('fill',col);if(bold) t.setAttribute('font-weight','600');
    t.textContent=txt;svg.appendChild(t);
  }
  function mkArrow(svg,x1,y1,x2,y2,col,dash,label){
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);
    const ux=dx/len,uy=dy/len,r=14;
    const ax=x1+ux*r,ay=y1+uy*r,bx=x2-ux*r,by=y2-uy*r;
    const line=document.createElementNS(NS,'line');
    line.setAttribute('x1',ax);line.setAttribute('y1',ay);
    line.setAttribute('x2',bx);line.setAttribute('y2',by);
    line.setAttribute('stroke',col);line.setAttribute('stroke-width',dash?'1':'1.5');
    if(dash) line.setAttribute('stroke-dasharray','3,2');
    svg.appendChild(line);
    const angle=Math.atan2(by-ay,bx-ax),ah=6;
    const poly=document.createElementNS(NS,'polygon');
    poly.setAttribute('points',`${bx},${by} ${bx-ah*Math.cos(angle-0.4)},${by-ah*Math.sin(angle-0.4)} ${bx-ah*Math.cos(angle+0.4)},${by-ah*Math.sin(angle+0.4)}`);
    poly.setAttribute('fill',col);svg.appendChild(poly);
    if(label){
      const mx=(ax+bx)/2,my=(ay+by)/2;
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',mx);t.setAttribute('y',my-5);
      t.setAttribute('text-anchor','middle');t.setAttribute('font-size','7');
      t.setAttribute('font-family','Sora,sans-serif');t.setAttribute('fill',col);
      t.textContent=label;svg.appendChild(t);
    }
  }
  function mkSketch(svg,x1,y1,x2,y2,col){
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    const line=document.createElementNS(NS,'line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke',col);line.setAttribute('stroke-width','1.5');
    line.setAttribute('stroke-dasharray','4,2');svg.appendChild(line);
    const rect=document.createElementNS(NS,'rect');
    rect.setAttribute('x',mx-14);rect.setAttribute('y',my-8);
    rect.setAttribute('width',28);rect.setAttribute('height',14);
    rect.setAttribute('rx',3);rect.setAttribute('fill','#EEEDFE');
    rect.setAttribute('stroke',col);rect.setAttribute('stroke-width','0.5');
    svg.appendChild(rect);
    mkText(svg,mx,my,'sketch',col,6,false);
  }

  // Flood diagram
  (function(){
    const svg=g('b18-s185-svg-flood');if(!svg) return;
    svg.innerHTML='';
    [1,2,3,4,5,6].forEach(i=>mkArrow(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(163,45,45,0.7)',false,'inv'));
    mkArrow(svg,NODES[1].x,NODES[1].y,NODES[2].x,NODES[2].y,'rgba(163,45,45,0.3)',false,'');
    mkArrow(svg,NODES[3].x,NODES[3].y,NODES[5].x,NODES[5].y,'rgba(163,45,45,0.3)',false,'');
    mkArrow(svg,NODES[4].x,NODES[4].y,NODES[6].x,NODES[6].y,'rgba(163,45,45,0.3)',false,'');
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#A32D2D','#791F1F');
    mkText(svg,NODES[0].x,NODES[0].y,'A','#fff',8,true);
    [1,2,3,4,5,6].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#F4F4F0','rgba(163,45,45,0.4)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#A32D2D',8,true);
    });
    mkText(svg,110,175,'Node A announce ke semua 6 peer','#A32D2D',7,false);
  })();

  // Erlay diagram
  (function(){
    const svg=g('b18-s185-svg-erlay');if(!svg) return;
    svg.innerHTML='';
    mkArrow(svg,NODES[0].x,NODES[0].y,NODES[1].x,NODES[1].y,'rgba(15,110,86,0.8)',false,'inv');
    mkArrow(svg,NODES[0].x,NODES[0].y,NODES[2].x,NODES[2].y,'rgba(15,110,86,0.8)',false,'inv');
    [3,4,5,6].forEach(i=>mkSketch(svg,NODES[0].x,NODES[0].y,NODES[i].x,NODES[i].y,'rgba(83,74,183,0.6)'));
    mkCircle(svg,NODES[0].x,NODES[0].y,16,'#0F6E56','#0a5540');
    mkText(svg,NODES[0].x,NODES[0].y,'A','#fff',8,true);
    [1,2].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#EAF3DE','rgba(15,110,86,0.5)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#0F6E56',8,true);
    });
    [3,4,5,6].forEach(i=>{
      mkCircle(svg,NODES[i].x,NODES[i].y,14,'#EEEDFE','rgba(83,74,183,0.4)');
      mkText(svg,NODES[i].x,NODES[i].y,LABELS[i],'#534AB7',8,true);
    });
    mkText(svg,110,170,'─ fanout langsung  ·· sketch recon','#3A3A35',7,false);
  })();

  const t1=g('b18-s185-t1'),t2=g('b18-s185-t2');
  const p1=g('b18-s185-p1'),p2=g('b18-s185-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s185-tab s185-act';t2.className='b18-s185-tab';
    p1.className='b18-s185-pane show';p2.className='b18-s185-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s185-tab s185-act';t1.className='b18-s185-tab';
    p2.className='b18-s185-pane show';p1.className='b18-s185-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.4 SIMULATION (Compact Block Simulator)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const TOTAL_TX=3000, AVG_TX_BYTE=500, BLOCK_FULL_KB=1500;

  function update(){
    const sl=g('b18-s184-sl');if(!sl) return;
    const pct=parseInt(sl.value);
    const vEl=g('b18-s184-sl-val');if(vEl) vEl.textContent=pct+'% sudah ada';
    const known=Math.round(TOTAL_TX*pct/100);
    const missing=TOTAL_TX-known;
    const kEl=g('b18-s184-known');if(kEl) kEl.textContent=known.toLocaleString('id-ID')+' tx';
    const mEl=g('b18-s184-missing');if(mEl) mEl.textContent=missing.toLocaleString('id-ID')+' tx';
    const shortidBytes=TOTAL_TX*6;
    const prefillBytes=500;
    const headerBytes=80;
    const missingBytes=missing*AVG_TX_BYTE;
    const cmpctBytes=headerBytes+shortidBytes+prefillBytes;
    const totalBytes=cmpctBytes+missingBytes;
    const totalKB=Math.round(totalBytes/1024*10)/10;
    const cmpctKB=Math.round(cmpctBytes/1024*10)/10;
    const missingKB=Math.round(missingBytes/1024*10)/10;
    const saving=Math.round((1-totalBytes/(BLOCK_FULL_KB*1024))*100);
    const maxKB=BLOCK_FULL_KB;
    function setBar(barId,txtId,valId,kb,label){
      const bar=g(barId);const txt=g(txtId);const val=g(valId);if(!bar||!txt||!val) return;
      bar.style.width=Math.max(1,Math.min(100,(kb/maxKB)*100))+'%';
      txt.textContent=label;val.textContent='~'+kb+' KB';
    }
    setBar('b18-s184-bar-cmpct','b18-s184-bar-cmpct-txt','b18-s184-val-cmpct',cmpctKB,'cmpctblock: header + shortids + prefill');
    setBar('b18-s184-bar-extra','b18-s184-bar-extra-txt','b18-s184-val-extra',missingKB,missing>0?`${missing} tx tidak dikenal`:'Tidak ada tx yang hilang!');
    setBar('b18-s184-bar-total','b18-s184-bar-total-txt','b18-s184-val-total',totalKB,`Total: ~${totalKB} KB`);
    const svEl=g('b18-s184-shortid-val');if(svEl) svEl.textContent=(shortidBytes/1000).toFixed(1)+' KB';
    const mvEl=g('b18-s184-missing-val');if(mvEl) mvEl.textContent=missing>0?'~'+missingKB+' KB':'0 KB (tidak ada!)';
    const tvEl=g('b18-s184-total-val');if(tvEl) tvEl.textContent='~'+totalKB+' KB vs '+BLOCK_FULL_KB+' KB';
    const sdEl=g('b18-s184-saving-desc');
    if(sdEl) sdEl.textContent=saving>0?`Hemat ~${saving}% bandwidth. ${Math.round(BLOCK_FULL_KB/totalKB)}x lebih kecil dari block penuh.`:'Kondisi tidak normal — terlalu banyak tx tidak dikenal.';
  }

  const sl=g('b18-s184-sl');if(sl) sl.addEventListener('input',update);
  update();

  const t1=g('b18-s184-t1'),t2=g('b18-s184-t2');
  const p1=g('b18-s184-p1'),p2=g('b18-s184-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s184-tab s184-act';t2.className='b18-s184-tab';
    p1.className='b18-s184-pane show';p2.className='b18-s184-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s184-tab s184-act';t1.className='b18-s184-tab';
    p2.className='b18-s184-pane show';p1.className='b18-s184-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.3 SIMULATION (Block Sync Visualizer)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const STRATEGIES={
    blocks:{
      phases:[
        {cls:'s183-ph-info',num:'1',title:'Kirim getblocks ke satu peer',
         desc:'Node mengirim getblocks dengan block locator. Peer membalas dengan inv berisi hingga 500 hash block berikutnya.',
         msg:'→ getblocks [block_locator] | ← inv [max 500 hashes]',time:'~1 detik'},
        {cls:'s183-ph-bad', num:'2',title:'Request dan tunggu block satu per satu',
         desc:'Node mengirim getdata untuk setiap block dan menunggu datang sebelum meminta berikutnya. Tidak bisa paralel.',
         msg:'→ getdata [block_N] | ← block [~1.5MB] | validasi... | → getdata [block_N+1]',time:'~detik per block'},
        {cls:'s183-ph-bad', num:'3',title:'Terikat ke satu peer',
         desc:'Seluruh sync bergantung pada kecepatan dan kejujuran satu peer. Kalau peer lambat atau tidak jujur, seluruh sync terdampak.',
         msg:'',time:'bottleneck utama'},
        {cls:'s183-ph-bad', num:'4',title:'Tidak tahu chain mana yang benar',
         desc:'Node tidak bisa verifikasi apakah ia sedang di chain terpanjang sampai sudah terlanjur download banyak block. Bisa buang waktu di chain yang salah.',
         msg:'',time:'risiko tinggi'},
      ],
    },
    headers:{
      phases:[
        {cls:'s183-ph-info',num:'1',title:'Download semua header via getheaders',
         desc:'Node mengirim getheaders dengan block locator. Peer membalas dengan hingga 2.000 header (~162 KB per respons). Ulangi sampai semua header ter-download.',
         msg:'→ getheaders [locator] | ← headers [max 2000 × 81B ≈ 162KB]',time:'~5 menit untuk 870.000 block'},
        {cls:'s183-ph-good',num:'2',title:'Hitung chainwork — tahu chain terpanjang tanpa download block',
         desc:'Dari header chain, node menghitung accumulated proof-of-work (chainwork) setiap chain yang ditawarkan berbagai peer. Chain dengan chainwork tertinggi adalah yang valid.',
         msg:'chainwork = Σ difficulty untuk setiap block di chain',time:'instan setelah headers'},
        {cls:'s183-ph-good',num:'3',title:'Download block paralel dari banyak peer',
         desc:'Karena urutan sudah diketahui dari header chain, node bisa download block dari berbagai peer sekaligus. Block #1 dari peer A, block #2 dari peer B, dst.',
         msg:'→ getdata [block_1] ke peer_A + getdata [block_2] ke peer_B + ...',time:'paralel, jauh lebih cepat'},
        {cls:'s183-ph-good',num:'4',title:'Resilient terhadap peer yang lambat atau curang',
         desc:'Kalau satu peer lambat, node switch ke peer lain. Chain sudah diverifikasi dari header — tidak bisa ditipu urutan yang salah.',
         msg:'assumevalid + parallel download + multi-peer = IBD optimal',time:'~4-24 jam'},
      ],
    },
  };

  let current='blocks';

  function renderStrategy(strat){
    const data=STRATEGIES[strat];if(!data) return;
    const el=g('b18-s183-phases');if(!el) return;
    el.innerHTML='';
    data.phases.forEach(p=>{
      const div=document.createElement('div');div.className=`b18-s183-phase ${p.cls}`;
      div.innerHTML=`<div class="b18-s183-phase-num">${p.num}</div>
        <div class="b18-s183-phase-body">
          <div class="b18-s183-phase-title">${p.title}</div>
          <div class="b18-s183-phase-desc">${p.desc}</div>
          ${p.msg?`<div class="b18-s183-phase-msg">${p.msg}</div>`:''}
        </div>
        <div class="b18-s183-phase-time">${p.time}</div>`;
      el.appendChild(div);
    });
  }

  const stratsEl=g('b18-s183-strats');
  if(stratsEl) stratsEl.querySelectorAll('.b18-s183-strat').forEach(btn=>{
    btn.addEventListener('click',()=>{
      stratsEl.querySelectorAll('.b18-s183-strat').forEach(b=>{
        const col=b.dataset.strat==='blocks'?'s183-red':'s183-green';
        b.className=`b18-s183-strat ${col}`;
      });
      const col=btn.dataset.strat==='blocks'?'s183-red':'s183-green';
      btn.className=`b18-s183-strat s183-act ${col}`;
      current=btn.dataset.strat;
      renderStrategy(current);
    });
  });
  renderStrategy('blocks');

  // Block locator visualization
  (function(){
    const el=g('b18-s183-locator-chain');if(!el) return;
    const TIP=30;
    const locatorOffsets=new Set([0,1,2,3,4,5,6,7,8,9,11,15,23,29]);
    for(let i=TIP;i>=0;i--){
      if(i<TIP){
        const arrow=document.createElement('div');
        arrow.className='b18-s183-block-arrow';arrow.textContent='←';
        el.appendChild(arrow);
      }
      const wrap=document.createElement('div');wrap.className='b18-s183-block';
      const rect=document.createElement('div');
      const offset=TIP-i;
      const isTip=i===TIP;
      const isLocator=locatorOffsets.has(offset);
      rect.className='b18-s183-block-rect '+(isTip?'s183-b-tip':isLocator?'s183-b-locator':'s183-b-normal');
      rect.textContent=isTip?'TIP':isLocator?'✓':'';
      rect.title=isTip?'Block tip #870.142 (dalam locator)':
                 isLocator?`Block #${870142-offset} (dalam locator)`:
                 `Block #${870142-offset}`;
      const ht=document.createElement('div');ht.className='b18-s183-block-ht';
      ht.textContent=isTip?'#870142':isLocator?`-${offset}`:'';
      wrap.appendChild(rect);wrap.appendChild(ht);
      el.appendChild(wrap);
    }
    const ellipsis=document.createElement('div');
    ellipsis.style.cssText='font-size:14px;color:#52524C;align-self:center;margin-bottom:14px;margin-left:4px;';
    ellipsis.textContent='...';
    el.appendChild(ellipsis);
    const genesis=document.createElement('div');genesis.className='b18-s183-block';
    const gr=document.createElement('div');gr.className='b18-s183-block-rect s183-b-locator';
    gr.textContent='✓';gr.title='Genesis block #0 (selalu ada di locator)';
    const gh=document.createElement('div');gh.className='b18-s183-block-ht';gh.textContent='#0';
    genesis.appendChild(gr);genesis.appendChild(gh);el.appendChild(genesis);
  })();

  const t1=g('b18-s183-t1'),t2=g('b18-s183-t2');
  const p1=g('b18-s183-p1'),p2=g('b18-s183-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s183-tab s183-act';t2.className='b18-s183-tab';
    p1.className='b18-s183-pane show';p2.className='b18-s183-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s183-tab s183-act';t1.className='b18-s183-tab';
    p2.className='b18-s183-pane show';p1.className='b18-s183-pane';
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.2 SIMULATION (Handshake & Message Flow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}

  const FLOW1=[
    {dir:'L',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim versi software (70016), services flags, timestamp, user agent "/Satoshi:27.0.0/", dan block height (#907.430). Ini adalah jabatan tangan pertama.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'Seperti diplomat yang menyerahkan kartu identitas: "saya dari negara X, bisa berbicara bahasa Y, saya tahu berita sampai tanggal Z."'},
    {dir:'R',msg:'version',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Node Kamu',
     desc:'Peer membalas dengan version miliknya. Sekarang keduanya saling tahu kapabilitas masing-masing.',
     bytes:'F9BEB4D9 | version | 66 byte payload',
     analogy:'Diplomat lawan juga menyerahkan kartu identitasnya — pertukaran perkenalan selesai.'},
    {dir:'L',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim verack — konfirmasi bahwa version peer sudah diterima dan valid. Tidak punya payload, hanya 24 byte header.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'Anggukan kepala: "oke, saya sudah tahu tentang kamu."'},
    {dir:'R',msg:'verack',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Peer',to:'Node Kamu',
     desc:'Peer juga mengirim verack. Setelah kedua verack diterima, handshake selesai. Sesi komunikasi Bitcoin resmi dimulai.',
     bytes:'F9BEB4D9 | verack | 00 00 00 00 (no payload)',
     analogy:'Jabat tangan selesai. Kedua diplomat bisa mulai membahas urusan penting.'},
    {dir:'L',msg:'sendcmpct',type:'s182-t-handshake',cls:'s182-d-handshake',from:'Node Kamu',to:'Peer',
     desc:'Node modern mengirim sendcmpct setelah verack — memberitahu peer bahwa kamu mendukung compact blocks (BIP 152) dan mode yang diprefer.',
     bytes:'F9BEB4D9 | sendcmpct | 09 byte payload',
     analogy:'Setelah jabat tangan: "omong-omong, saya lebih suka komunikasi ringkas — pakai format compact block kalau kirim block baru."'},
    {dir:'L',msg:'inv',type:'s182-t-tx',cls:'s182-d-tx',from:'Node Kamu',to:'Peer',
     desc:'Kamu punya transaksi baru. Umumkan via inv dengan txid — jangan langsung kirim data penuh, tanya dulu apakah peer sudah punya.',
     bytes:'F9BEB4D9 | inv | count:1 | type:MSG_TX | txid (32B)',
     analogy:'Seperti toko yang pasang pengumuman "ada produk baru!" — tidak langsung antar ke semua pelanggan, lihat dulu siapa yang tertarik.'},
    {dir:'R',msg:'getdata',type:'s182-t-tx',cls:'s182-d-tx',from:'Peer',to:'Node Kamu',
     desc:'Peer belum punya transaksi ini. Ia membalas dengan getdata berisi txid yang sama: "tolong kirimkan transaksi itu ke saya."',
     bytes:'F9BEB4D9 | getdata | count:1 | type:MSG_TX | txid (32B)',
     analogy:'Pelanggan yang tertarik mengisi formulir pesanan: "saya mau produk nomor ini."'},
    {dir:'L',msg:'tx',type:'s182-t-tx',cls:'s182-d-tx',from:'Node Kamu',to:'Peer',
     desc:'Kamu mengirim transaksi penuh. Peer memvalidasinya — cek signature, cek UTXO, cek aturan konsensus. Kalau valid, peer mengulang inv/getdata/tx ke peer-peer lainnya.',
     bytes:'F9BEB4D9 | tx | [full tx data: inputs, outputs, witness]',
     analogy:'Produk dikirim. Pelanggan memeriksa kualitasnya — kalau bagus, ia rekomendasikan ke teman-temannya.'},
    {dir:'B',msg:'propagasi selesai',type:'s182-t-tx',cls:'s182-d-tx',from:'',to:'',
     desc:'Transaksi sudah ada di mempool node pertama. Proses inv/getdata/tx ini berulang ke ribuan node lain — dalam 2-5 detik, transaksi sudah diketahui mayoritas jaringan.',
     bytes:'',
     analogy:'Seperti berita yang menyebar dari mulut ke mulut — setiap orang yang tahu memberitahu kenalannya, sampai semua orang tahu.'},
  ];

  const FLOW2=[
    {dir:'L',msg:'inv (block)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara lama: miner mengumumkan block baru via inv. Node lain harus request block penuh — lambat untuk block berukuran 1-2 MB.',
     bytes:'F9BEB4D9 | inv | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Memberitahu teman "saya punya koran baru" — mereka harus datang ambil sendiri salinan 200 halaman.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Node lain meminta block penuh. Kalau 8 peer melakukan ini sekaligus, miner harus kirim 8 salinan block yang sama — sangat boros bandwidth.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Delapan teman sekaligus minta salinan koran — penjual harus fotokopi 8 kali.'},
    {dir:'L',msg:'block (penuh)',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Block penuh dikirim (~1-2 MB). Untuk jaringan ribuan node, ini tidak efisien. Block bisa butuh beberapa detik untuk menyebar — meningkatkan risiko stale block.',
     bytes:'F9BEB4D9 | block | [header + semua transaksi: ~1-2 MB]',
     analogy:'Fotokopi koran 200 halaman untuk setiap orang — lambat dan boros.'},
    {dir:'L',msg:'headers',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara lebih baik (headers-first): kirim header block dulu (80 byte). Node penerima bisa validasi proof-of-work dari header sebelum memutuskan apakah butuh block penuh.',
     bytes:'F9BEB4D9 | headers | [80 byte header: prev_hash, merkle_root, PoW]',
     analogy:'Kirim ringkasan eksekutif dulu — baru kalau tertarik, minta detailnya.'},
    {dir:'R',msg:'getdata (block)',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Setelah validasi header dan PoW, node penerima memutuskan block ini valid dan memintanya.',
     bytes:'F9BEB4D9 | getdata | type:MSG_BLOCK | block_hash (32B)',
     analogy:'Setelah baca ringkasan dan tertarik, baru pesan buku lengkapnya.'},
    {dir:'L',msg:'cmpctblock',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Cara terbaik (compact blocks, BIP 152): kirim sketsa block berisi header + txid pendek (6 byte). Penerima rekonstruksi dari mempool — transaksi yang sudah dikenal tidak perlu download ulang.',
     bytes:'F9BEB4D9 | cmpctblock | [80B header + txid pendek: ~20KB vs 1.5MB]',
     analogy:'Kirim daftar nomor halaman koran yang sudah kamu punya — hanya halaman yang belum ada yang perlu dikirim.'},
    {dir:'R',msg:'getblocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Node Lain',to:'Miner',
     desc:'Kalau ada transaksi di block yang tidak dikenali (tidak ada di mempool), node penerima minta spesifik transaksi tersebut. Biasanya hanya 0-5% transaksi yang perlu diminta.',
     bytes:'F9BEB4D9 | getblocktxn | block_hash | [daftar index tx yang dibutuhkan]',
     analogy:'Dari 3000 halaman, kamu hanya butuh 5 halaman yang belum ada — minta 5 halaman itu saja.'},
    {dir:'L',msg:'blocktxn',type:'s182-t-block',cls:'s182-d-block',from:'Miner',to:'Node Lain',
     desc:'Miner mengirim hanya transaksi yang diminta. Node rekonstruksi block penuh dan validasi. Total data: ~20-50 KB vs 1-2 MB. 10-40x lebih cepat dari metode klasik.',
     bytes:'F9BEB4D9 | blocktxn | [hanya tx yang diminta, bukan seluruh block]',
     analogy:'Lima halaman dikirim. Pembaca rakit koran lengkap dari halaman yang sudah ada + 5 halaman baru. Selesai dalam sepersekian waktu.'},
  ];

  function buildFlow(flow, tlId, detailId, nextId, rstId, indId, idleText){
    const tl=g(tlId);if(!tl) return;
    tl.innerHTML='';
    let step=-1;

    flow.forEach((s,i)=>{
      const row=document.createElement('div');
      row.className='b18-s182-step';row.id=`${tlId}-s${i}`;
      const isL=s.dir==='L';const isR=s.dir==='R';const isB=s.dir==='B';
      const leftContent=isL?`<div><span class="b18-s182-msg-tag ${s.type}">${s.msg}</span> <span class="b18-s182-arrow">→</span></div>`:'';
      const rightContent=isR?`<div><span class="b18-s182-arrow">←</span> <span class="b18-s182-msg-tag ${s.type}">${s.msg}</span></div>`:
                         isB?`<div style="text-align:center"><span class="b18-s182-msg-tag ${s.type}">${s.msg}</span></div>`:'';
      row.innerHTML=`<div class="b18-s182-step-left">${leftContent}</div>
        <div class="b18-s182-step-mid"><div class="b18-s182-step-dot"></div></div>
        <div class="b18-s182-step-right">${rightContent}</div>`;
      tl.appendChild(row);
    });

    function update(){
      flow.forEach((_,i)=>{
        const el=g(`${tlId}-s${i}`);if(!el) return;
        if(i<step) el.className='b18-s182-step s182-done';
        else if(i===step) el.className='b18-s182-step s182-active';
        else el.className='b18-s182-step';
      });
      const ind=g(indId);if(ind) ind.textContent=`${Math.max(0,step+1)} / ${flow.length} langkah`;
      const nb=g(nextId);if(nb) nb.disabled=step>=flow.length-1;
      const detail=g(detailId);if(!detail) return;
      if(step<0){
        detail.className='b18-s182-detail s182-d-idle';
        detail.innerHTML=`<div class="b18-s182-detail-label">Menunggu</div>
          <div class="b18-s182-detail-title">${idleText.title}</div>
          <div class="b18-s182-detail-text">${idleText.text}</div>`;
      } else {
        const s=flow[step];
        detail.className=`b18-s182-detail ${s.cls}`;
        detail.innerHTML=`<div class="b18-s182-detail-label">Langkah ${step+1}: ${s.from}${s.to?' → '+s.to:''}</div>
          <div class="b18-s182-detail-title"><span class="b18-s182-msg-tag ${s.type}" style="font-size:12px;">${s.msg}</span></div>
          <div class="b18-s182-detail-text">${s.desc}</div>
          ${s.bytes?`<div class="b18-s182-detail-bytes">📦 ${s.bytes}</div>`:''}
          ${s.analogy?`<div class="b18-s182-detail-analogy">${s.analogy}</div>`:''}`;
      }
    }

    const nb=g(nextId);const rb=g(rstId);
    if(nb) nb.addEventListener('click',()=>{if(step<flow.length-1){step++;update();}});
    if(rb) rb.addEventListener('click',()=>{step=-1;update();});
    update();
  }

  buildFlow(FLOW1,'b18-s182-tl1','b18-s182-detail1','b18-s182-next1','b18-s182-rst1','b18-s182-ind1',
    {title:'Koneksi TCP baru saja dibuka',text:'Dua node baru saja terhubung di level TCP. Handshake harus diselesaikan sebelum komunikasi Bitcoin bisa dimulai.'});
  buildFlow(FLOW2,'b18-s182-tl2','b18-s182-detail2','b18-s182-next2','b18-s182-rst2','b18-s182-ind2',
    {title:'Miner baru saja menemukan block #870.143',text:'Block baru valid. Harus disebarkan ke seluruh jaringan secepat mungkin sebelum miner lain menemukan block di height yang sama.'});

  const tabs=['b18-s182-t1','b18-s182-t2','b18-s182-t3'];
  const panes=['b18-s182-p1','b18-s182-p2','b18-s182-p3'];
  tabs.forEach((tid,i)=>{
    const btn=g(tid);if(!btn) return;
    btn.addEventListener('click',()=>{
      tabs.forEach(t=>{const el=g(t);if(el) el.className='b18-s182-tab';});
      panes.forEach(p=>{const el=g(p);if(el) el.className='b18-s182-pane';});
      const el=g(tid);if(el) el.className='b18-s182-tab s182-act';
      const pe=g(panes[i]);if(pe) pe.className='b18-s182-pane show';
    });
  });
})();

// ============================================================
// PAGE 21 · BAB 18 · 18.1 SIMULATION (Wire Message Inspector)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const NS='http://www.w3.org/2000/svg';

  const MSGS={
    version:{
      cmd:'version',
      desc:'Pesan pertama yang dikirim saat dua node terhubung. Berisi versi software, services, timestamp, user agent, dan block height.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657273696F6E0000000000',cls:'s181-command',note:'Command: "version" + null padding'},
        {val:'66000000',cls:'s181-length',note:'Payload length: 102 byte'},
        {val:'3B648D5F',cls:'s181-check',note:'SHA256(SHA256(payload))[0:4]'},
        {val:'80110100',cls:'s181-payload',note:'Protocol version: 70016'},
        {val:'0D04000000000000',cls:'s181-payload',note:'Services flags bitmask'},
        {val:'E2B67F6200000000',cls:'s181-payload',note:'Timestamp (Unix)'},
        {val:'000000000000000000000000',cls:'s181-payload',note:'addr_recv IP + port'},
        {val:'0D04000000000000',cls:'s181-payload',note:'addr_trans services'},
        {val:'00000000000000000000FFFF',cls:'s181-payload',note:'addr_trans IP'},
        {val:'208D',cls:'s181-payload',note:'Port: 8333'},
        {val:'E1B5B4A3C7F34B2E',cls:'s181-payload',note:'Nonce random'},
        {val:'102F5361746F7368693A32372E302E302F',cls:'s181-payload',note:'User agent string'},
        {val:'A6B80D00',cls:'s181-payload',note:'Start height: #907.430'},
        {val:'01',cls:'s181-payload',note:'Relay: true'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'Kode pengenal jaringan. Setiap byte pertama dari setiap pesan wajib dimulai dengan kode ini.',
         analogy:'Analogi: seperti kode area di nomor telepon. Kalau kode areanya salah, sambungan langsung diputus tanpa mendengar sisanya.'},
        {cls:'s181-command',name:'Command', bytes:'"version" + 5x null',
         desc:'Nama perintah 12 byte dalam ASCII, dipadding null bytes. Memberitahu penerima pesan ini jenis apa.',
         analogy:'Analogi: seperti subject email yang selalu punya panjang persis sama agar sistem bisa membacanya secara otomatis.'},
        {cls:'s181-length', name:'Length',  bytes:'66 00 00 00',
         desc:'Ukuran payload dalam byte (little-endian). Memberitahu penerima berapa byte yang harus dibaca setelah header.',
         analogy:'Analogi: seperti tulisan "berat bersih 250g" di kemasan makanan — penerima tahu persis berapa yang harus diambil.'},
        {cls:'s181-check',  name:'Checksum',bytes:'3B 64 8D 5F',
         desc:'4 byte pertama dari SHA256(SHA256(payload)). Verifikasi bahwa payload tidak rusak di perjalanan.',
         analogy:'Analogi: seperti nomor seri di uang kertas — kalau tidak cocok, pesan diabaikan sepenuhnya.'},
        {cls:'s181-payload',name:'Payload', bytes:'80 11 01 00 ...',
         desc:'Isi pesan: versi (70016), services flags, timestamp, informasi alamat, nonce, user agent, block height, relay flag.',
         analogy:'Analogi: isi surat yang sebenarnya — semua informasi yang ingin disampaikan, dibungkus oleh header yang standar.'},
      ],
      showFlags:true,
    },
    verack:{
      cmd:'verack',
      desc:'Konfirmasi handshake. Dikirim setelah menerima version yang valid. Tidak punya payload — hanya 24 byte header.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'76657261636B000000000000',cls:'s181-command',note:'Command: "verack" + null padding'},
        {val:'00000000',cls:'s181-length',note:'Payload length: 0 byte'},
        {val:'5DF6E0E2',cls:'s181-check',note:'Checksum dari payload kosong'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9',
         desc:'Penanda jaringan mainnet.',
         analogy:'Analogi: kop surat resmi — penerima langsung tahu ini dari jaringan Bitcoin yang benar.'},
        {cls:'s181-command',name:'Command', bytes:'"verack" + 6x null',
         desc:'Konfirmasi bahwa handshake berhasil. Setelah verack diterima kedua sisi, sesi komunikasi resmi dimulai.',
         analogy:'Analogi: jabat tangan setelah saling memperkenalkan diri — "oke, saya sudah mengerti siapa kamu, mari mulai bicara."'},
        {cls:'s181-length', name:'Length',  bytes:'00 00 00 00',
         desc:'Payload 0 byte. verack adalah pesan terpendek di protokol Bitcoin.',
         analogy:'Analogi: seperti mengangguk saja tanpa kata-kata — tidak perlu penjelasan panjang, cukup konfirmasi.'},
        {cls:'s181-check',  name:'Checksum',bytes:'5D F6 E0 E2',
         desc:'Checksum dari payload kosong. Nilai ini selalu sama untuk verack manapun.',
         analogy:'Analogi: tanda tangan di dokumen kosong yang selalu identik karena tidak ada isi yang berbeda.'},
      ],
      showFlags:false,
    },
    inv:{
      cmd:'inv',
      desc:'Inventory — mengumumkan ke peer bahwa node punya transaksi atau block baru, tanpa langsung mengirim datanya. Peer yang tertarik akan balas dengan getdata.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'696E760000000000000000',cls:'s181-command',note:'Command: "inv" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 byte'},
        {val:'B3F9E1A4',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item dalam inventory'},
        {val:'01000000',cls:'s181-payload',note:'Type: MSG_TX (0x01) — transaksi. 0x02 = block'},
        {val:'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2',cls:'s181-payload',note:'Hash txid 32 byte'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',
         analogy:'Analogi: amplop dengan logo resmi Bitcoin di pojok kiri atas.'},
        {cls:'s181-command',name:'Command', bytes:'"inv"',
         desc:'Inventory announcement. Efisien karena node tidak langsung kirim data penuh — hanya mengumumkan ketersediaan.',
         analogy:'Analogi: seperti poster "Ada koran baru!" di depan kios — tidak memaksa semua orang membeli, hanya mengumumkan.'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00',
         desc:'37 byte: 1 byte count + (4 byte type + 32 byte hash) per item. Bisa berisi hingga 50.000 item sekaligus.',
         analogi:''},
        {cls:'s181-check',  name:'Checksum',bytes:'B3 F9 E1 A4', desc:'Verifikasi integritas payload.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 01000000 | hash...',
         desc:'1 item, type MSG_TX (transaksi), diikuti 32 byte txid. Peer yang ingin transaksi ini akan kirim getdata.',
         analogy:'Analogi: daftar katalog produk — hanya ID produk, bukan produknya sendiri. Kalau tertarik, baru pesan.'},
      ],
      showFlags:false,
    },
    getdata:{
      cmd:'getdata',
      desc:'Request data spesifik. Format identik dengan inv tapi artinya: "kirimkan data ini ke saya." Dikirim sebagai respons terhadap inv.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'6765746461746100000000',cls:'s181-command',note:'Command: "getdata" + null padding'},
        {val:'25000000',cls:'s181-length',note:'Payload length: 37 byte'},
        {val:'C4A8E3F2',cls:'s181-check',note:'Checksum'},
        {val:'01',cls:'s181-payload',note:'Count: 1 item yang diminta'},
        {val:'02000000',cls:'s181-payload',note:'Type: MSG_BLOCK (0x02) — minta block'},
        {val:'00000000000000000001A4B2C8D9E7F3A6B5C4D1E2F0A9B8C7D6E5F4A3B2C1D0',cls:'s181-payload',note:'Hash block yang diminta'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"getdata"',
         desc:'Request data dari peer. Peer akan merespons dengan mengirim tx, block, atau data lain yang diminta.',
         analogy:'Analogi: setelah melihat katalog (inv), kamu mengisi formulir pesanan (getdata) — "saya mau item nomor ini."'},
        {cls:'s181-length', name:'Length',  bytes:'25 00 00 00', desc:'37 byte payload, format identik dengan inv.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'C4 A8 E3 F2', desc:'Verifikasi integritas.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'01 | 02000000 | hash...',
         desc:'1 item, type MSG_BLOCK, diikuti 32 byte block hash. Node akan merespons dengan mengirimkan block penuh.',
         analogy:'Analogi: nomor pesanan yang persis dan spesifik — tidak bisa ambigu, harus hash yang tepat.'},
      ],
      showFlags:false,
    },
    ping:{
      cmd:'ping',
      desc:'Keepalive — memverifikasi koneksi masih hidup. Peer harus balas dengan pong yang berisi nonce yang sama. Kalau tidak ada respons, koneksi dianggap mati.',
      bytes:[
        {val:'F9BEB4D9',cls:'s181-magic',note:'Magic bytes mainnet'},
        {val:'70696E670000000000000000',cls:'s181-command',note:'Command: "ping" + null padding'},
        {val:'08000000',cls:'s181-length',note:'Payload length: 8 byte'},
        {val:'D4F6A2B3',cls:'s181-check',note:'Checksum'},
        {val:'A3F8C2E1D4B7920F',cls:'s181-payload',note:'Nonce: 8 byte random, harus di-echo-back'},
      ],
      fields:[
        {cls:'s181-magic',  name:'Magic',   bytes:'F9 BE B4 D9', desc:'Penanda jaringan mainnet.',analogy:''},
        {cls:'s181-command',name:'Command', bytes:'"ping"',
         desc:'Keepalive request. Peer yang tidak merespons dalam 20 menit akan di-disconnect secara otomatis.',
         analogy:'Analogi: seperti mengetuk pintu dan menunggu jawaban — "halo, kamu masih di sana?" Tidak ada jawaban = pintu ditutup.'},
        {cls:'s181-length', name:'Length',  bytes:'08 00 00 00', desc:'8 byte payload — hanya nonce.',analogy:''},
        {cls:'s181-check',  name:'Checksum',bytes:'D4 F6 A2 B3', desc:'Checksum payload.',analogy:''},
        {cls:'s181-payload',name:'Payload', bytes:'A3 F8 C2 E1 D4 B7 92 0F',
         desc:'8 byte nonce random. Peer harus echo-back nonce yang sama di pesan pong. Ini memastikan pong benar-benar respons dari ping ini.',
         analogy:'Analogi: kamu bilang kata rahasia acak, dan teman harus mengulangnya kembali — membuktikan bahwa ia benar-benar mendengar dan responsif.'},
      ],
      showFlags:false,
    },
  };

  const FLAGS=[
    {bit:'0x01',name:'NODE_NETWORK',    on:true, desc:'Node menyimpan full blockchain dan bisa melayani block historis kepada peer yang butuh IBD.'},
    {bit:'0x02',name:'NODE_GETUTXO',    on:false,desc:'Deprecated BIP 64. Mengizinkan query UTXO langsung. Hampir tidak dipakai lagi.'},
    {bit:'0x04',name:'NODE_BLOOM',      on:true, desc:'Node mendukung BIP 37 bloom filter. Banyak node modern menonaktifkan ini karena BIP 37 deprecated.'},
    {bit:'0x08',name:'NODE_WITNESS',    on:true, desc:'Node mendukung SegWit (BIP 141). Wajib untuk semua node modern.'},
    {bit:'0x10',name:'NODE_XTHIN',      on:false,desc:'Xthin block relay. Alternatif compact blocks yang tidak dipakai lagi.'},
    {bit:'0x40',name:'NODE_COMPACT_FILTERS',on:true,desc:'Node mendukung BIP 157/158 compact block filters untuk SPV client modern.'},
    {bit:'0x0400',name:'NODE_NETWORK_LIMITED',on:false,desc:'Pruned node — hanya menyimpan 288 block terakhir. Tidak bisa layani IBD penuh.'},
  ];

  let currentMsg='version';

  function renderHex(msgId){
    const msg=MSGS[msgId];if(!msg) return;
    const body=g('b18-s181-hex-body');const cmd=g('b18-s181-hex-cmd');if(!body||!cmd) return;
    cmd.textContent=msg.cmd;body.innerHTML='';
    let allBytes=[];
    msg.bytes.forEach(b=>{
      const hex=b.val.replace(/\s/g,'');
      for(let i=0;i<hex.length;i+=2) allBytes.push({hex:hex.slice(i,i+2),cls:b.cls,note:b.note});
    });
    let offset=0;
    for(let row=0;row<allBytes.length;row+=16){
      const rowEl=document.createElement('div');rowEl.className='b18-s181-hex-row';
      const off=document.createElement('span');off.className='b18-s181-hex-offset';
      off.textContent=offset.toString(16).padStart(4,'0')+':';
      rowEl.appendChild(off);
      const bytesEl=document.createElement('div');bytesEl.className='b18-s181-hex-bytes';
      for(let i=row;i<Math.min(row+16,allBytes.length);i++){
        const b=allBytes[i];
        const span=document.createElement('span');
        span.className='b18-s181-byte '+b.cls;
        span.textContent=b.hex;span.title=b.note;
        bytesEl.appendChild(span);
      }
      rowEl.appendChild(bytesEl);body.appendChild(rowEl);offset+=16;
    }
  }

  function renderFields(msgId){
    const msg=MSGS[msgId];if(!msg) return;
    const el=g('b18-s181-fields');if(!el) return;
    el.innerHTML='';
    msg.fields.forEach(f=>{
      const div=document.createElement('div');div.className=`b18-s181-field ${f.cls}`;
      let html=`<div class="b18-s181-field-top">
        <div class="b18-s181-field-name">${f.name}</div>
        <div class="b18-s181-field-bytes">${f.bytes}</div>
        <div class="b18-s181-field-desc">${f.desc}</div>
      </div>`;
      if(f.analogy) html+=`<div class="b18-s181-field-analogy">${f.analogy}</div>`;
      div.innerHTML=html;
      el.appendChild(div);
    });
    const flagsEl=g('b18-s181-flags');const flagsInner=g('b18-s181-flags-inner');
    if(flagsEl&&flagsInner){
      flagsEl.style.display=msg.showFlags?'flex':'none';
      if(msg.showFlags){
        flagsInner.innerHTML='';
        FLAGS.forEach(f=>{
          const div=document.createElement('div');div.className=`b18-s181-flag ${f.on?'s181-on':'s181-off'}`;
          div.innerHTML=`<div class="b18-s181-flag-bit">${f.bit}</div>
            <div class="b18-s181-flag-name">${f.name}</div>
            <div class="b18-s181-flag-desc">${f.desc}</div>`;
          flagsInner.appendChild(div);
        });
      }
    }
  }

  function selectMsg(id){
    currentMsg=id;
    document.querySelectorAll('.b18-s181-msg-btn').forEach(b=>b.classList.toggle('s181-act',b.dataset.msg===id));
    renderHex(id);renderFields(id);
  }

  // Build msg buttons
  (function(){
    const el=g('b18-s181-msgs');if(!el) return;
    Object.keys(MSGS).forEach(key=>{
      const btn=document.createElement('button');
      btn.className='b18-s181-msg-btn'+(key==='version'?' s181-act':'');
      btn.dataset.msg=key;btn.textContent=key;
      btn.addEventListener('click',()=>selectMsg(key));
      el.appendChild(btn);
    });
  })();

  function buildTopology(){
    const svg=g('b18-s181-net-svg');if(!svg) return;
    svg.innerHTML='';
    const cx=280,cy=130;
    const outPeers=[
      {x:80, y:40},  {x:200,y:25},  {x:340,y:20},  {x:460,y:45},
      {x:505,y:155}, {x:435,y:235}, {x:145,y:240}, {x:60, y:185},
    ];
    const inPeers=[{x:285,y:240},{x:350,y:185}];
    function mkLine(x1,y1,x2,y2,col,dash){
      const l=document.createElementNS(NS,'line');
      l.setAttribute('x1',x1);l.setAttribute('y1',y1);
      l.setAttribute('x2',x2);l.setAttribute('y2',y2);
      l.setAttribute('stroke',col);l.setAttribute('stroke-width','1.5');
      if(dash) l.setAttribute('stroke-dasharray','4,3');
      svg.appendChild(l);
    }
    function mkCircle(x,y,r,fill,stroke){
      const c=document.createElementNS(NS,'circle');
      c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
      c.setAttribute('fill',fill);c.setAttribute('stroke',stroke);c.setAttribute('stroke-width','1.5');
      svg.appendChild(c);
    }
    function mkText(x,y,txt,col,sz,bold){
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',x);t.setAttribute('y',y);
      t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
      t.setAttribute('font-size',sz||9);t.setAttribute('font-family','Sora,sans-serif');
      t.setAttribute('fill',col||'#3A3A35');
      if(bold) t.setAttribute('font-weight','600');
      t.textContent=txt;svg.appendChild(t);
    }
    outPeers.forEach((p,i)=>{
      mkLine(cx,cy,p.x,p.y,'rgba(83,74,183,0.5)',false);
      mkCircle(p.x,p.y,13,'#EEEDFE','#534AB7');
      mkText(p.x,p.y,'OUT','#534AB7',7,true);
    });
    inPeers.forEach(p=>{
      mkLine(cx,cy,p.x,p.y,'rgba(15,110,86,0.4)',true);
      mkCircle(p.x,p.y,11,'#EAF3DE','#0F6E56');
      mkText(p.x,p.y,'IN','#0F6E56',7,true);
    });
    mkCircle(cx,cy,22,'#534AB7','#3C3489');
    mkText(cx,cy-5,'Node','#fff',9,true);
    mkText(cx,cy+7,'Kamu','#fff',9,true);
    // Legend
    mkLine(15,265,35,265,'rgba(83,74,183,0.5)',false);
    mkText(95,265,'8 outbound (kamu yang pilih)','#534AB7',8);
    mkLine(210,265,230,265,'rgba(15,110,86,0.4)',true);
    mkText(295,265,'inbound (pasif)','#0F6E56',8);
    const note=g('b18-s181-net-note');
    if(note) note.textContent='8 outbound connections (garis solid, ungu) dipilih aktif oleh node kamu — kamu yang memutuskan terhubung ke siapa. Inbound connections (garis putus-putus, hijau) diinisiasi peer lain yang datang kepadamu. Outbound lebih dipercaya karena sulit bagi attacker untuk mengisolasi node kamu kalau kamu yang memilih peer-nya.';
    // Services flags
    const svc=g('b18-s181-svc-flags');if(!svc) return;
    svc.innerHTML='';
    FLAGS.forEach(f=>{
      const div=document.createElement('div');div.className=`b18-s181-flag ${f.on?'s181-on':'s181-off'}`;
      div.innerHTML=`<div class="b18-s181-flag-bit">${f.bit}</div>
        <div class="b18-s181-flag-name">${f.name}</div>
        <div class="b18-s181-flag-desc">${f.desc}</div>`;
      svc.appendChild(div);
    });
  }

  const t1=g('b18-s181-t1'),t2=g('b18-s181-t2');
  const p1=g('b18-s181-p1'),p2=g('b18-s181-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b18-s181-tab s181-act';t2.className='b18-s181-tab';
    p1.className='b18-s181-pane show';p2.className='b18-s181-pane';
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b18-s181-tab s181-act';t1.className='b18-s181-tab';
    p2.className='b18-s181-pane show';p1.className='b18-s181-pane';
    buildTopology();
  });

  selectMsg('version');
  buildTopology();
})();

