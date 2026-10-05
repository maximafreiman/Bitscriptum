// ============================================================
// PAGE 17 · BAB 14 · NAVIGATION
// ============================================================
function showSectionInContentB14(sectionId, sbId) {
  document.querySelectorAll('#page-bab14 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab14 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab14-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 17 · BAB 14 · TOPBAR
// ============================================================
document.getElementById('back-home-b14').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b14').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 17 · BAB 14 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab14').addEventListener('click', () => navigate('page-bab14'));

// ============================================================
// PAGE 17 · BAB 14 · SIDEBAR EVENTS (14.1 - 14.6)
// ============================================================
document.getElementById('sb-14-1').addEventListener('click', () => showSectionInContentB14('section-14-1', 'sb-14-1'));
document.getElementById('sb-14-2').addEventListener('click', () => showSectionInContentB14('section-14-2', 'sb-14-2'));
document.getElementById('sb-14-3').addEventListener('click', () => showSectionInContentB14('section-14-3', 'sb-14-3'));
document.getElementById('sb-14-4').addEventListener('click', () => showSectionInContentB14('section-14-4', 'sb-14-4'));
document.getElementById('sb-14-5').addEventListener('click', () => showSectionInContentB14('section-14-5', 'sb-14-5'));
document.getElementById('sb-14-6').addEventListener('click', () => showSectionInContentB14('section-14-6', 'sb-14-6'));

// ============================================================
// PAGE 17 · BAB 14 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab14 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB14(target, sb);
  });
});

// ============================================================
// PAGE 17 · BAB 14 · 14.6 SIMULATION (Battle-tested)
// ============================================================
(function() {
  const rows=[
    {row:'b14-s146-r1', detail:'b14-s146-d1'},
    {row:'b14-s146-r2', detail:'b14-s146-d2'},
    {row:'b14-s146-r3', detail:'b14-s146-d3'},
    {row:'b14-s146-r4', detail:'b14-s146-d4'},
    {row:'b14-s146-r5', detail:'b14-s146-d5'},
  ];
  rows.forEach(({row,detail})=>{
    const rowEl=document.getElementById(row);
    const detailEl=document.getElementById(detail);
    if(!rowEl||!detailEl) return;
    rowEl.addEventListener('click',()=>{
      const isOpen=detailEl.classList.contains('open');
      rows.forEach(({detail:d})=>{
        const el=document.getElementById(d);
        if(el) el.classList.remove('open');
      });
      if(!isOpen) detailEl.classList.add('open');
    });
  });
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.5 SIMULATION (Eclipse Attack)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const TEXT=dark?'#E0DED8':'#1A1A18';
  const MUTED=dark?'#6A6A62':'#52524C';

  function drawNode(ctx,x,y,r,bg,border,label,sub){
    ctx.save();
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border;ctx.lineWidth=2;ctx.stroke();
    if(label){ctx.fillStyle=TEXT;ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,y);}
    if(sub){ctx.fillStyle=MUTED;ctx.font='7px Sora,sans-serif';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(sub,x,y+r+3);}
    ctx.restore();
  }
  function drawLine(ctx,x1,y1,x2,y2,col){
    ctx.save();ctx.strokeStyle=col;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
  }
  function drawText(ctx,x,y,t,col,sz,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${sz}px 'Sora',sans-serif`;
    ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.fillText(t,x,y);
  }

  function draw(){
    const cv=g('b14-s145-cv');if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=250;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);

    const NR=13,TR=17;
    const half=W/2-6;
    const lx=half/2,rx=half+6+half/2,cy=H/2;

    // Labels
    drawText(ctx,lx,18,'Normal Node','#0F6E56',10,true,'center');
    drawText(ctx,rx,18,'Eclipsed Node','#A32D2D',10,true,'center');

    // Divider
    ctx.save();ctx.strokeStyle='rgba(124,58,237,0.1)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(half+6,22);ctx.lineTo(half+6,H-8);ctx.stroke();ctx.setLineDash([]);ctx.restore();

    // LEFT: normal peers
    const lPeers=[{a:-85,d:68},{a:-30,d:68},{a:30,d:68},{a:90,d:68},{a:150,d:68},{a:210,d:68}];
    lPeers.forEach(({a,d})=>{
      const rad=a*Math.PI/180,px=lx+Math.cos(rad)*d,py=cy+Math.sin(rad)*d;
      drawLine(ctx,lx,cy,px,py,'rgba(83,74,183,0.22)');
      drawNode(ctx,px,py,NR,'#EEEDFE','rgba(83,74,183,0.4)','peer','');
    });
    drawNode(ctx,lx,cy,TR,'#EAF3DE','#0F6E56','node','(you)');
    drawText(ctx,lx,H-16,'Information from various sources','#0F6E56',8,false,'center');

    // RIGHT: eclipsed node
    const rPeers=[{a:-85,d:68},{a:-30,d:68},{a:30,d:68},{a:90,d:68},{a:150,d:68},{a:210,d:68}];
    rPeers.forEach(({a,d})=>{
      const rad=a*Math.PI/180,px=rx+Math.cos(rad)*d,py=cy+Math.sin(rad)*d;
      drawLine(ctx,rx,cy,px,py,'rgba(163,45,45,0.3)');
      drawNode(ctx,px,py,NR,'#FCEBEB','rgba(163,45,45,0.5)','atk','attacker');
    });
    drawNode(ctx,rx,cy,TR,'#FCEBEB','#A32D2D','node','isolated!');

    // Isolation ring
    ctx.save();ctx.strokeStyle='rgba(163,45,45,0.25)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.arc(rx,cy,84,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();

    // X marks
    [[rx+84,cy-28],[rx+80,cy+38]].forEach(([cx2,cy2])=>{
      ctx.save();ctx.strokeStyle='rgba(163,45,45,0.5)';ctx.lineWidth=1.8;ctx.lineCap='round';
      const s=5;
      ctx.beginPath();ctx.moveTo(cx2-s,cy2-s);ctx.lineTo(cx2+s,cy2+s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx2+s,cy2-s);ctx.lineTo(cx2-s,cy2+s);ctx.stroke();
      ctx.restore();
    });
    drawText(ctx,rx,H-16,'Only receives info from the attacker','#A32D2D',8,false,'center');
  }

  const t1=g('b14-s145-t1'),t2=g('b14-s145-t2');
  const p1=g('b14-s145-p1'),p2=g('b14-s145-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s145-tab s145-act';t2.className='b14-s145-tab';
    p1.className='b14-s145-pane show';p2.className='b14-s145-pane';
    requestAnimationFrame(draw);
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s145-tab s145-act';t1.className='b14-s145-tab';
    p2.className='b14-s145-pane show';p1.className='b14-s145-pane';
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(draw)).observe(g('b14-s145-cv')||document.body);
  }
  draw();
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.4 SIMULATION (Selfish Mining)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34,RD=6;
  let curStep=0;

  function drawBlock(ctx,x,y,lbl,bg,fg,border,dashed){
    ctx.save();
    if(dashed){ctx.setLineDash([3,2]);ctx.globalAlpha=0.6;}
    ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.setLineDash([]);ctx.globalAlpha=1;
    ctx.fillStyle=fg;ctx.font='bold 9px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='12px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }
  function setupCanvas(){
    const cv=g('b14-s144-cv');if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=220;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);
    return {ctx,W,H};
  }

  const STEPS=[
    {note:'Initial state: all miners mine on the same chain honestly.',noteClass:'s144-idle',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Mining on block #100 openly'},{cls:'s144-selfish',label:'Dishonest miner',val:'Also mining on block #100 normally'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#98','#99','#100'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-14,'All nodes mine on the same chain','#0F6E56',9,true,'left');
       drawText(ctx,14,H-16,'Honest and dishonest miners both mine block #101','#52524C',9,false,'left');
     }},
    {note:'The dishonest miner finds block #101 first — but does NOT broadcast it to the network!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Still mining block #101\nDoesn’t know block #101 has been found'},{cls:'s144-selfish',label:'Dishonest miner',val:'Already has block #101 hidden\nImmediately mining block #102 on top of it'}],
     draw(ctx,W,H){
       const pubY=H*0.3,hidY=H*0.7;
       drawText(ctx,14,pubY-16,'Honest network — doesn’t know #101 has been found','#0F6E56',9,true,'left');
       ['#99','#100'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<1) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawBlock(ctx,14+2*52,pubY-BS/2,'#101?','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       drawArrow(ctx,14+2*52-9,pubY,'rgba(160,160,152,0.4)');
       drawText(ctx,14+2*52+BS+4,pubY,'still mining...','#52524C',9,false,'left');
       drawText(ctx,14,hidY-16,'Dishonest miner — hidden chain','#A32D2D',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,hidY);});
       drawText(ctx,14+2*52+BS+4,hidY+BS/2,'hidden (eye crossed out)','#A32D2D',9,false,'left');
     }},
    {note:'The dishonest miner has found #102. Two blocks ahead behind the scenes!',noteClass:'s144-warn',
     status:[{cls:'s144-honest',label:'Honest miners (network)',val:'Just found block #101\nAnnouncing to the network'},{cls:'s144-selfish',label:'Dishonest miner',val:'Already has #101 and #102 hidden\nTwo blocks ahead behind the scenes'}],
     draw(ctx,W,H){
       const pubY=H*0.28,hidY=H*0.72;
       drawText(ctx,14,pubY-16,'Honest network — just found #101','#0F6E56',9,true,'left');
       ['#99','#100','#101'].forEach((l,i)=>{drawBlock(ctx,14+i*52,pubY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');if(i<2) drawArrow(ctx,14+i*52+BS+9,pubY);});
       drawText(ctx,14,hidY-16,'Dishonest miner — already 2 blocks ahead','#A32D2D',9,true,'left');
       ['#99','#100','#101','#102'].forEach((l,i)=>{drawBlock(ctx,14+i*52,hidY-BS/2,l,i<2?'#EEEDFE':'#FCEBEB',i<2?'#534AB7':'#A32D2D',i<2?'rgba(83,74,183,0.3)':'rgba(163,45,45,0.3)');if(i<3) drawArrow(ctx,14+i*52+BS+9,hidY);});
     }},
    {note:'The dishonest miner releases the hidden chain! The honest block #101 becomes an orphan.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Honest miners — lose',val:'Block #101 becomes an orphan\nLoses the reward already earned'},{cls:'s144-selfish',label:'Dishonest miner — wins',val:'Chain released — 2 blocks longer\nThe network follows the longest chain'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*'].forEach((l,i)=>{
         drawBlock(ctx,14+i*52,y,l,i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D'),i<2?'#534AB7':(i===2?'#A32D2D':'#fff'),i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D'));
         if(i<3) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'The dishonest miner’s chain is released — longer, the network follows','#A32D2D',9,true,'left');
       const ox=14+2*52,oy=y+BS+26;
       drawBlock(ctx,ox,oy,'#101','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,2]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
       drawText(ctx,ox+BS+4,oy+BS/2,'orphan — reward lost','#A32D2D',9,false,'left');
     }},
    {note:'Result: the dishonest miner gets the reward of 2 blocks, the honest miner loses 1. But this only works in an ideal scenario.',noteClass:'s144-bad',
     status:[{cls:'s144-honest',label:'Honest miners — lose',val:'Block #101 becomes an orphan\nLoses the reward'},{cls:'s144-result',label:'Important note',val:'This only works if the dishonest miner has >33% hash rate and can keep block secrecy perfectly'}],
     draw(ctx,W,H){
       const y=H/2-BS/2-10;
       ['#99','#100','#101*','#102*','#103'].forEach((l,i)=>{
         const isNew=i===4;
         drawBlock(ctx,14+i*52,y,l,isNew?'#EAF3DE':(i<2?'#EEEDFE':(i===2?'#FCEBEB':'#A32D2D')),isNew?'#0F6E56':(i<2?'#534AB7':(i===2?'#A32D2D':'#fff')),isNew?'rgba(15,110,86,0.3)':(i<2?'rgba(83,74,183,0.3)':(i===2?'rgba(163,45,45,0.3)':'#A32D2D')));
         if(i<4) drawArrow(ctx,14+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,14,y-16,'The chain continues — the strategy works in this scenario','#1A1A18',9,true,'left');
       const ox=14+2*52,oy=y+BS+26;
       drawBlock(ctx,ox,oy,'#101','#F4F4F0','#52524C','rgba(160,160,152,0.2)',true);
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,2]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
       drawText(ctx,ox+BS+4,oy+BS/2,'orphan','#A32D2D',9,false,'left');
     }},
  ];

  function renderStep(i){
    const r=setupCanvas();if(!r) return;
    const {ctx,W,H}=r;
    STEPS[i].draw(ctx,W,H);
    const st=g('b14-s144-status');
    if(st) st.innerHTML=STEPS[i].status.map(s=>`
      <div class="b14-s144-status-card ${s.cls}">
        <div class="b14-s144-status-label">${s.label}</div>
        <div class="b14-s144-status-val">${s.val}</div>
      </div>`).join('');
    const note=g('b14-s144-note');
    if(note){note.textContent=STEPS[i].note;note.className=`b14-s144-note ${STEPS[i].noteClass}`;}
    const ind=g('b14-s144-step-ind');
    if(ind) ind.textContent=`Step ${i} / ${STEPS.length-1}`;
    const btn=g('b14-s144-next');
    if(btn) btn.disabled=(i>=STEPS.length-1);
  }

  const nextBtn=g('b14-s144-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{if(curStep<STEPS.length-1){curStep++;renderStep(curStep);}});
  const rstBtn=g('b14-s144-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{curStep=0;renderStep(0);const b=g('b14-s144-next');if(b) b.disabled=false;});

  const t1=g('b14-s144-t1'),t2=g('b14-s144-t2');
  const p1=g('b14-s144-p1'),p2=g('b14-s144-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s144-tab s144-act';t2.className='b14-s144-tab';
    p1.className='b14-s144-pane show';p2.className='b14-s144-pane';
    requestAnimationFrame(()=>renderStep(curStep));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s144-tab s144-act';t1.className='b14-s144-tab';
    p2.className='b14-s144-pane show';p1.className='b14-s144-pane';
  });
  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>renderStep(curStep))).observe(g('b14-s144-cv')||document.body);
  }
  renderStep(0);
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.3 SIMULATION (2013 Chain Split)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=32,RD=6;

  function drawBlock(ctx,x,y,lbl,bg,fg,border){
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=fg;ctx.font='bold 8px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='11px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }

  function drawDiagram(){
    const cv=g('b14-s143-cv');if(!cv) return;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    const H=230;
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);

    const AW=16,GAP=5,STEP=BS+GAP+AW+GAP;
    const SX=12,midY=H/2,topY=36,botY=H-40-BS;

    ['#225428','#225429'].forEach((l,i)=>{
      drawBlock(ctx,SX+i*STEP,midY-BS/2,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
      if(i<1) drawArrow(ctx,SX+i*STEP+BS+AW/2+GAP,midY);
    });

    const stemX=SX+STEP+BS+GAP,forkX=stemX+16;
    ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(stemX,midY);ctx.lineTo(forkX,midY);
    ctx.moveTo(forkX,midY);ctx.lineTo(forkX,topY+BS/2);
    ctx.moveTo(forkX,midY);ctx.lineTo(forkX,botY+BS/2);
    ctx.stroke();ctx.restore();

    const CX=forkX+GAP;

    drawText(ctx,CX,topY-13,'Bitcoin 0.8 (LevelDB) — ~60% hash rate, briefly longer','#534AB7',9,true,'left');
    ['#225430','#225431','#225432'].forEach((l,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,topY+BS/2,'rgba(83,74,183,0.4)');
      drawBlock(ctx,bx,topY,l,'#534AB7','#fff','#534AB7');
    });
    drawText(ctx,CX+3*STEP+2,topY+BS/2,'... (24 blocks)','#A32D2D',9,false,'left');

    drawText(ctx,CX,botY+BS+12,'Bitcoin 0.7 (BerkeleyDB) — ~40% hash rate, wins after pool downgrade','#854F0B',9,true,'left');
    ['#225430b','#225431b'].forEach((l,i)=>{
      const bx=CX+i*STEP;
      if(i>0) drawArrow(ctx,bx-AW/2-GAP+AW,botY+BS/2,'rgba(133,79,11,0.4)');
      drawBlock(ctx,bx,botY,l,'#FAEEDA','#854F0B','rgba(133,79,11,0.3)');
    });

    const mx=CX+STEP;
    ctx.save();ctx.strokeStyle='#0F6E56';ctx.lineWidth=1.5;ctx.setLineDash([3,2]);
    ctx.beginPath();ctx.moveTo(mx+BS/2,topY+BS);ctx.lineTo(mx+BS/2,botY);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
    drawText(ctx,mx+BS+4,(topY+BS+botY)/2,'BTCGuild + Slush downgrade','#0F6E56',9,true,'left');

    const wx=CX+2*STEP;
    drawArrow(ctx,wx-AW/2-GAP+AW,botY+BS/2,'rgba(15,110,86,0.4)');
    drawBlock(ctx,wx,botY,'#225454','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
    drawText(ctx,wx+BS+4,botY+BS/2,'chain 0.7 wins at #225,454 ✓','#0F6E56',9,true,'left');

    drawText(ctx,forkX,midY+12,'split','#A32D2D',8,false,'center');
  }

  const tabs=['b14-s143-t1','b14-s143-t2','b14-s143-t3'];
  const panes=['b14-s143-p1','b14-s143-p2','b14-s143-p3'];
  tabs.forEach((id,i)=>{
    const el=g(id); if(!el) return;
    el.addEventListener('click',()=>{
      tabs.forEach((t,j)=>{const e=g(t);if(e) e.className='b14-s143-tab'+(i===j?' s143-act':'');});
      panes.forEach((p,j)=>{const e=g(p);if(e) e.className='b14-s143-pane'+(i===j?' show':'');});
      if(i===0) requestAnimationFrame(drawDiagram);
    });
  });

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(drawDiagram)).observe(g('b14-s143-cv')||document.body);
  }
  drawDiagram();
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.2 SIMULATION (Reorg)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  const dark=matchMedia('(prefers-color-scheme:dark)').matches;
  const BG=dark?'#1A1A18':'#F4F4F0';
  const MUTED=dark?'#3A3A35':'#52524C';
  const BS=34,RD=6;
  let curStep=0;

  function drawBlock(ctx,x,y,lbl,bg,fg,border){
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,BS,BS,RD);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border||'transparent';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=fg;ctx.font='bold 9px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(lbl,x+BS/2,y+BS/2);ctx.restore();
  }
  function drawArrow(ctx,x,y,col){
    ctx.fillStyle=col||MUTED;ctx.font='12px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('→',x,y);
  }
  function drawText(ctx,x,y,txt,col,size,bold,align){
    ctx.fillStyle=col;ctx.font=`${bold?'600 ':''}${size}px 'Sora',sans-serif`;
    ctx.textAlign=align||'left';ctx.textBaseline='middle';ctx.fillText(txt,x,y);
  }
  function setupCanvas(id,h){
    const cv=g(id);if(!cv) return null;
    const dpr=devicePixelRatio||1;
    const W=cv.getBoundingClientRect().width||400;
    cv.width=W*dpr;cv.height=h*dpr;
    const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    ctx.fillStyle=BG;ctx.fillRect(0,0,W,h);
    return {ctx,W,H:h};
  }

  const STEPS=[
    {note:'Initial state: the network runs normally. All nodes agree on the same chain.',noteClass:'s142-idle',
     status:[{cls:'s142-main',label:'Main chain',val:'#100 → #101 → #102\nAll nodes follow this chain'}],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'All nodes agree — one chain','#0F6E56',9,true,'left');
     }},
    {note:'Two miners find block #103 almost simultaneously! The network is temporarily split in two.',noteClass:'s142-info',
     status:[
       {cls:'s142-alt',label:'Chain A (Miner A)',val:'... → #102 → #103A\nSome nodes follow this'},
       {cls:'s142-alt',label:'Chain B (Miner B)',val:'... → #102 → #103B\nSome nodes follow this'},
     ],
     draw(ctx,W,H){
       const sharedY=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,sharedY,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,sharedY+BS/2);
       });
       const fx=20+2*52+BS+10,fy=sharedY+BS/2;
       ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
       ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+16,fy);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.26);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.74);
       ctx.stroke();ctx.restore();
       drawBlock(ctx,fx+18,H*0.26-BS/2,'#103A','#534AB7','#fff','#534AB7');
       drawText(ctx,fx+22+BS,H*0.26,'Miner A','#534AB7',9,true,'left');
       drawBlock(ctx,fx+18,H*0.74-BS/2,'#103B','#0F6E56','#fff','#0F6E56');
       drawText(ctx,fx+22+BS,H*0.74,'Miner B','#0F6E56',9,true,'left');
     }},
    {note:'Miner A finds block #104 faster. Chain A is now longer!',noteClass:'s142-info',
     status:[
       {cls:'s142-main',label:'Chain A — longest',val:'#102 → #103A → #104A\nLength: 2 blocks after the fork'},
       {cls:'s142-orphan',label:'Chain B — shorter',val:'#102 → #103B\nLength: 1 block after the fork'},
     ],
     draw(ctx,W,H){
       const sharedY=H/2-BS/2;
       ['#100','#101','#102'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,sharedY,l,'#EEEDFE','#534AB7','rgba(83,74,183,0.3)');
         if(i<2) drawArrow(ctx,20+i*52+BS+9,sharedY+BS/2);
       });
       const fx=20+2*52+BS+10,fy=sharedY+BS/2;
       ctx.save();ctx.strokeStyle='rgba(124,58,237,0.2)';ctx.lineWidth=1.5;
       ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+16,fy);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.28);
       ctx.moveTo(fx+16,fy);ctx.lineTo(fx+16,H*0.72);
       ctx.stroke();ctx.restore();
       drawBlock(ctx,fx+18,H*0.28-BS/2,'#103A','#534AB7','#fff','#534AB7');
       drawArrow(ctx,fx+18+BS+9,H*0.28,'rgba(83,74,183,0.5)');
       drawBlock(ctx,fx+18+52,H*0.28-BS/2,'#104A','#534AB7','#fff','#534AB7');
       drawText(ctx,fx+18,H*0.28-BS/2-13,'← LONGER','#0F6E56',9,true,'left');
       drawBlock(ctx,fx+18,H*0.72-BS/2,'#103B','#EAF3DE','#0F6E56','rgba(15,110,86,0.3)');
       drawText(ctx,fx+22+BS,H*0.72+BS/2+2,'shorter','#A32D2D',9,false,'left');
     }},
    {note:'Reorg! Nodes following Chain B switch to Chain A. Block #103B becomes an orphan.',noteClass:'s142-warn',
     status:[
       {cls:'s142-main',label:'Main chain (after reorg)',val:'#100 → #101 → #102 → #103A → #104A\nAll nodes agree again'},
       {cls:'s142-orphan',label:'Orphan block',val:'#103B discarded\nIts transactions return to the mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A'].forEach((l,i)=>{
         drawBlock(ctx,20+i*52,y,l,i<3?'#EEEDFE':'#534AB7',i<3?'#534AB7':'#fff',i<3?'rgba(83,74,183,0.3)':'#534AB7');
         if(i<4) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Single chain — all nodes agree','#0F6E56',9,true,'left');
       const ox=20+3*52,oy=y+BS+24;
       drawBlock(ctx,ox,oy,'#103B','#FCEBEB','#A32D2D','rgba(163,45,45,0.3)');
       drawText(ctx,ox+BS+6,oy+BS/2,'orphan — discarded','#A32D2D',9,false,'left');
       ctx.save();ctx.strokeStyle='rgba(163,45,45,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
       ctx.beginPath();ctx.moveTo(ox+BS/2,y+BS);ctx.lineTo(ox+BS/2,oy);ctx.stroke();ctx.restore();
     }},
    {note:'Done. A 1-block reorg is a normal event. Miner B loses the reward but the network stays safe.',noteClass:'s142-good',
     status:[
       {cls:'s142-main',label:'Chain continues normally',val:'Block #105 found on top of #104A\nReorg done, the network is safe'},
       {cls:'s142-orphan',label:'Consequence for miner B',val:'Loses the reward of block #103B\nIts transactions return to the mempool'},
     ],
     draw(ctx,W,H){
       const y=H/2-BS/2;
       ['#100','#101','#102','#103A','#104A','#105'].forEach((l,i)=>{
         const isNew=i===5;
         drawBlock(ctx,20+i*52,y,l,isNew?'#EAF3DE':(i<3?'#EEEDFE':'#534AB7'),isNew?'#0F6E56':(i<3?'#534AB7':'#fff'),isNew?'rgba(15,110,86,0.3)':(i<3?'rgba(83,74,183,0.3)':'#534AB7'));
         if(i<5) drawArrow(ctx,20+i*52+BS+9,y+BS/2);
       });
       drawText(ctx,20,y-14,'Network continues — reorg complete','#0F6E56',9,true,'left');
     }},
  ];

  function renderStep(i){
    const r=setupCanvas('b14-s142-cv',220);if(!r) return;
    const {ctx,W,H}=r;
    STEPS[i].draw(ctx,W,H);
    const st=g('b14-s142-status');
    if(st) st.innerHTML=STEPS[i].status.map(s=>`
      <div class="b14-s142-status-card ${s.cls}">
        <div class="b14-s142-status-label">${s.label}</div>
        <div class="b14-s142-status-val">${s.val}</div>
      </div>`).join('');
    const note=g('b14-s142-note');
    if(note){note.textContent=STEPS[i].note;note.className=`b14-s142-note ${STEPS[i].noteClass}`;}
    const ind=g('b14-s142-step-ind');
    if(ind) ind.textContent=`Step ${i} / ${STEPS.length-1}`;
    const btn=g('b14-s142-next');
    if(btn) btn.disabled=(i>=STEPS.length-1);
  }

  const nextBtn=g('b14-s142-next');
  if(nextBtn) nextBtn.addEventListener('click',()=>{if(curStep<STEPS.length-1){curStep++;renderStep(curStep);}});
  const rstBtn=g('b14-s142-rst');
  if(rstBtn) rstBtn.addEventListener('click',()=>{curStep=0;renderStep(0);const b=g('b14-s142-next');if(b) b.disabled=false;});

  const t1=g('b14-s142-t1'),t2=g('b14-s142-t2');
  const p1=g('b14-s142-p1'),p2=g('b14-s142-p2');
  if(t1) t1.addEventListener('click',()=>{
    t1.className='b14-s142-tab s142-act';t2.className='b14-s142-tab';
    p1.className='b14-s142-pane show';p2.className='b14-s142-pane';
    requestAnimationFrame(()=>renderStep(curStep));
  });
  if(t2) t2.addEventListener('click',()=>{
    t2.className='b14-s142-tab s142-act';t1.className='b14-s142-tab';
    p2.className='b14-s142-pane show';p1.className='b14-s142-pane';
  });

  if(typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>requestAnimationFrame(()=>renderStep(curStep))).observe(g('b14-s142-cv')||document.body);
  }
  renderStep(0);
})();

// ============================================================
// PAGE 17 · BAB 14 · 14.1 SIMULATION (Integer Overflow)
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  let running=false;

  const STEPS=[
    {icon:'✓',cls:'s141-normal',
     title:'Normal value: 50 BTC (block reward)',
     val:'5,000,000,000 satoshi = 50 BTC',
     desc:'A valid value. Far below MAX_MONEY. If the code checks MAX_MONEY, this value passes correctly.',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'⚠️',cls:'s141-bad',
     title:'Bug: the code does NOT check MAX_MONEY before adding up the outputs',
     val:'// The missing line: if (nValue > MAX_MONEY) return false;',
     desc:'This is the core of the bug. The code adds up the output values directly without first checking whether each output exceeds MAX_MONEY (21 million BTC).',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'The attacker creates two outputs that far exceed MAX_MONEY',
     val:'Output A: 92,233,720,368 BTC  |  Output B: 92,233,720,369 BTC',
     desc:'Each far exceeds MAX_MONEY of 21 million BTC. But because there’s no check, the code proceeds to the addition.',
     bits:'0111111111111111111111111111111111111111111111111111111111111110',
     neg:false,overflow:false},
    {icon:'💥',cls:'s141-bad',
     title:'Adding the two outputs exceeds MAX_INT64 — overflow!',
     val:'The total output exceeds the 64-bit integer limit, the sign bit becomes 1',
     desc:'When added, the total exceeds MAX_INT64. The number wraps into a large negative number.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'💥',cls:'s141-result',
     title:'The node thinks the total output is NEGATIVE — smaller than the input!',
     val:'Validation: total output <= total input? Met because the output became negative.',
     desc:'Because the overflow made the total output negative, validation passes. The transaction is confirmed in block #74,638.',
     bits:'1000000000000000000000000000000000000000000000000000000000000000',
     neg:true,overflow:true},
    {icon:'✓',cls:'s141-fix',
     title:'Satoshi’s patch: check MAX_MONEY before adding up',
     val:'if (nValue < 0 || nValue > MAX_MONEY) return false;',
     desc:'In 5 hours Satoshi released a patch. Block #74,638 was rolled back. The bitcoin that appeared to be created never really existed. This is an implementation bug, not a protocol bug.',
     bits:'0000000000000000000000000000000100101010000001011111001000000000',
     neg:false,overflow:false},
  ];

  function renderBits(bitstr, overflow){
    const el=g('b14-s141-bits'); if(!el) return;
    el.innerHTML='';
    for(let i=0;i<64;i++){
      const b=document.createElement('div');
      const isOne=bitstr[i]==='1';
      b.className='b14-s141-bit '+(overflow&&i===0?'s141-overflow':(isOne?'s141-one':'s141-zero'));
      b.textContent=bitstr[i];
      el.appendChild(b);
    }
  }

  function renderVal(neg, val){
    const el=g('b14-s141-bits-val'); if(!el) return;
    el.textContent=val;
    el.style.color=neg?'#A32D2D':'#1A1A18';
  }

  function addStep(d){
    const el=g('b14-s141-steps'); if(!el) return;
    const div=document.createElement('div');
    div.className=`b14-s141-step ${d.cls}`;
    div.innerHTML=`
      <div class="b14-s141-step-icon">${d.icon}</div>
      <div class="b14-s141-step-content">
        <div class="b14-s141-step-title">${d.title}</div>
        <div class="b14-s141-step-val">${d.val}</div>
        <div class="b14-s141-step-desc">${d.desc}</div>
      </div>`;
    div.style.opacity='0'; div.style.transform='translateY(6px)';
    el.appendChild(div);
    requestAnimationFrame(()=>{
      div.style.transition='all 0.35s';
      div.style.opacity='1'; div.style.transform='translateY(0)';
    });
  }

  async function run(){
    running=true;
    const rb=g('b14-s141-run'); if(rb) rb.disabled=true;
    const note=g('b14-s141-note');
    for(let i=0;i<STEPS.length;i++){
      const d=STEPS[i];
      renderBits(d.bits,d.overflow);
      renderVal(d.neg,d.val);
      addStep(d);
      if(note){note.textContent=d.title;note.className='b14-s141-note s141-done';}
      await wait(i<2?900:700);
    }
    if(note){note.textContent='Important note: the bitcoin that appeared to be created never really existed because it was immediately rolled back. This is an implementation bug, not a protocol bug. The 21 million BTC supply was never truly threatened.';note.className='b14-s141-note s141-done';}
    running=false;
    if(rb) rb.disabled=false;
  }

  function reset(){
    if(running) return;
    renderBits('0'.repeat(64),false);
    renderVal(false,'Value: 0 satoshi');
    const el=g('b14-s141-steps'); if(el) el.innerHTML='';
    const rb=g('b14-s141-run'); if(rb) rb.disabled=false;
    const note=g('b14-s141-note');
    if(note){note.textContent='Click "Simulate the Bug" to see how a value exceeding MAX_MONEY passes validation because the code doesn’t check it.';note.className='b14-s141-note s141-idle';}
  }

  renderBits('0'.repeat(64),false);
  renderVal(false,'Value: 0 satoshi');
  const runBtn=g('b14-s141-run'); if(runBtn) runBtn.addEventListener('click',()=>{if(!running) run();});
  const rstBtn=g('b14-s141-rst'); if(rstBtn) rstBtn.addEventListener('click',reset);
})();

