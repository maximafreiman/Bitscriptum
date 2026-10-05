// ============================================================
// PAGE 8 · BAB 5 · NAVIGATION
// ============================================================
function showSectionInContentB5(sectionId, sbId) {
  document.querySelectorAll('#page-bab5 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab5 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab5-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 8 · BAB 5 · TOPBAR
// ============================================================
document.getElementById('back-home-b5').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b5').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 8 · BAB 5 · SIDEBAR EVENTS (5.1 - 5.6)
// ============================================================
document.getElementById('sb-5-1').addEventListener('click', () => showSectionInContentB5('section-5-1', 'sb-5-1'));
document.getElementById('sb-5-2').addEventListener('click', () => showSectionInContentB5('section-5-2', 'sb-5-2'));
document.getElementById('sb-5-3').addEventListener('click', () => showSectionInContentB5('section-5-3', 'sb-5-3'));
document.getElementById('sb-5-4').addEventListener('click', () => showSectionInContentB5('section-5-4', 'sb-5-4'));
document.getElementById('sb-5-5').addEventListener('click', () => showSectionInContentB5('section-5-5', 'sb-5-5'));
document.getElementById('sb-5-6').addEventListener('click', () => showSectionInContentB5('section-5-6', 'sb-5-6'));

// ============================================================
// PAGE 8 · BAB 5 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab5 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB5(target, sb);
  });
});

// ============================================================
// PAGE 8 · BAB 5 · 5.1 SIMULATION (Konsensus)
// ============================================================
(function() {
  const canvas = document.getElementById('b05-s51-canvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG   = dark ? '#1A1A18' : '#F4F4F0';
  const LINE = dark ? 'rgba(124,92,252,0.3)' : 'rgba(83,74,183,0.2)';
  const PURP = '#534AB7';
  const RED  = '#A32D2D';
  const TXT2 = dark ? '#A0A098' : '#3A3A35';
  const NR   = 15;

  function polygon(n, cx, cy, r) {
    return Array.from({length:n}, (_,i) => {
      const a = (i/n)*Math.PI*2 - Math.PI/2;
      return {x: cx + r*Math.cos(a), y: cy + r*Math.sin(a)};
    });
  }

  function drawNode(x, y, label, color, pulse) {
    const rr = NR + (pulse||0);
    ctx.fillStyle = color===PURP ? (dark?'rgba(83,74,183,0.2)':'#EEEDFE') : (dark?'rgba(163,45,45,0.2)':'#FCEBEB');
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x,y,rr,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.font = '500 9px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  }

  function drawDashed(x1,y1,x2,y2) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.strokeStyle='rgba(163,45,45,0.3)'; ctx.lineWidth=0.8;
    ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }

  const SCENARIOS = {
    t1: { main:8, outsiders:[], note:'✅ All nodes form one consensus and move together.', ok:true },
    t2: { main:7, outsiders:[{label:'N8'}], note:'⚠️ 1 node refuses and leaves the consensus. The rest keep going together.', ok:false },
    t3: { main:6, outsiders:[{label:'N7'},{label:'N8'}], note:'⚠️ 2 nodes separate and form their own fork chain. Two different networks.', ok:false },
  };

  let active = 't1';
  let animT  = 0;

  function draw() {
    const dpr = window.devicePixelRatio||1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = 300;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const sc = SCENARIOS[active];
    const cx = W*0.55, cy = H/2 - 8;
    const r  = Math.min(W,H)*0.27;
    const pulse = 0.7*Math.sin(animT*0.04);
    const pts = polygon(sc.main, cx, cy, r);

    // Edges konsensus
    pts.forEach((p,i) => {
      const j=(i+1)%pts.length;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pts[j].x,pts[j].y);
      ctx.strokeStyle=LINE; ctx.lineWidth=1; ctx.stroke();
    });

    // Node konsensus
    pts.forEach((p,i) => drawNode(p.x,p.y,`N${i+1}`,PURP,pulse));

    const out = sc.outsiders;
    const leftmost = pts.reduce((b,p)=>p.x<b.x?p:b, pts[0]);

    if (out.length === 1) {
      const ox = cx - r*1.75, oy = cy;
      drawDashed(leftmost.x - NR - 2, leftmost.y, ox + NR + 4, oy);
      drawNode(ox, oy, out[0].label, RED);
      ctx.fillStyle=RED; ctx.font='9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText('leaves', ox, oy+NR+4);
    } else if (out.length === 2) {
      const ox = cx - r*1.75, oy1 = cy - 22, oy2 = cy + 22;
      ctx.beginPath(); ctx.moveTo(ox,oy1); ctx.lineTo(ox,oy2);
      ctx.strokeStyle='rgba(163,45,45,0.35)'; ctx.lineWidth=1; ctx.stroke();
      drawDashed(leftmost.x - NR - 2, leftmost.y, ox + NR + 4, (oy1+oy2)/2);
      drawNode(ox, oy1, out[0].label, RED);
      drawNode(ox, oy2, out[1].label, RED);
      ctx.fillStyle=RED; ctx.font='9px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText('fork', ox, oy2+NR+4);
    }

    ctx.fillStyle=TXT2; ctx.font='10px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText('Consensus', W/2, H-8);
  }

  function animate(){animT++;draw();requestAnimationFrame(animate);}

  function setScenario(id){
    active=id;
    ['t1','t2','t3'].forEach(t=>{
      const btn=document.getElementById('b05-s51-'+t);
      if(!btn)return;
      btn.className='cs-tab'+(t!=='t1'?' cs-fork':'')+(t===id?' active':'');
    });
    const sc=SCENARIOS[id];
    const el=document.getElementById('b05-s51-result');
    if(el){el.textContent=sc.note;el.className='cs-result '+(sc.ok?'ok':'fork');}
  }

  ['t1','t2','t3'].forEach(t=>{
    const btn=document.getElementById('b05-s51-'+t);
    if(btn) btn.addEventListener('click',()=>setScenario(t));
  });

  setScenario('t1');
  animate();
  if(typeof ResizeObserver!=='undefined') new ResizeObserver(()=>requestAnimationFrame(()=>draw())).observe(canvas);
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.1 FORK SIMULATION (Soft fork vs Hard fork)
// ============================================================
(function() {
  const dark = matchMedia('(prefers-color-scheme:dark)').matches;
  const BG   = dark ? '#1A1A18' : '#F8F8F6';
  const PURP = '#534AB7';
  const GRAY = dark ? '#6A6A68' : '#52524C';
  const RED  = '#A32D2D';
  const TXT  = dark ? '#A0A098' : '#3A3A35';

  function setupCanvas(id) {
    const c = document.getElementById(id);
    if (!c) return null;
    const dpr = window.devicePixelRatio||1;
    const w   = c.getBoundingClientRect().width || 200;
    const h   = 220;
    c.width   = w*dpr; c.height = h*dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr,dpr);
    return {ctx, w, h};
  }

  function drawBlock(ctx, x, y, color) {
    const bw=22, bh=15;
    ctx.fillStyle = color===PURP?(dark?'rgba(83,74,183,0.25)':'#EEEDFE')
                  : color===RED ?(dark?'rgba(163,45,45,0.25)':'#FCEBEB')
                  : (dark?'rgba(100,100,100,0.2)':'#F0EFEA');
    ctx.strokeStyle=color; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.roundRect(x-bw/2,y-bh/2,bw,bh,3); ctx.fill(); ctx.stroke();
  }

  function drawChain(ctx, n, y, color, startX, gap) {
    for(let i=0;i<n;i++){
      const x=startX+i*gap;
      if(i>0){
        ctx.beginPath(); ctx.moveTo(x-gap+11,y); ctx.lineTo(x-11,y);
        ctx.strokeStyle=color; ctx.lineWidth=0.7; ctx.stroke();
      }
      drawBlock(ctx,x,y,color);
    }
  }

  function drawLabel(ctx, x, y, txt, color) {
    ctx.fillStyle=color; ctx.font='9px sans-serif';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y);
  }

  function drawSoftFork() {
    const res = setupCanvas('b05-s51-fk-soft');
    if(!res) return;
    const {ctx,w,h}=res;
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,w,h,8); ctx.fill();

    const gap=30, sx=22, sharedN=3;
    // Rantai bersama
    drawChain(ctx,sharedN,65,PURP,sx,gap);

    const splitX=sx+(sharedN-1)*gap;
    ctx.fillStyle=TXT; ctx.font='8px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('fork point',splitX,78);

    // Rantai baru — lebih panjang
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,5,newY,PURP,splitX+gap,gap);
    drawLabel(ctx,splitX+5*gap+4,newY,'new nodes (longer)',PURP);

    // Rantai lama — lebih pendek, lalu menyerah
    const oldY=150;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,oldY);
    ctx.strokeStyle=GRAY; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,2,oldY,GRAY,splitX+gap,gap);

    // X di rantai lama (abandoned)
    const ex=splitX+2*gap;
    ctx.strokeStyle=RED; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(ex-8,oldY-5); ctx.lineTo(ex+8,oldY+5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+8,oldY-5); ctx.lineTo(ex-8,oldY+5); ctx.stroke();

    // Panah menyerah ke rantai panjang
    ctx.beginPath();
    ctx.moveTo(splitX+gap,oldY-8);
    ctx.lineTo(splitX+gap+24,newY+8);
    ctx.strokeStyle=GRAY; ctx.lineWidth=0.7;
    ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);

    drawLabel(ctx,sx,185,'Longest chain wins',PURP);
    drawLabel(ctx,sx,198,'Old nodes follow unaware',TXT);
  }

  function drawHardFork() {
    const res = setupCanvas('b05-s51-fk-hard');
    if(!res) return;
    const {ctx,w,h}=res;
    ctx.fillStyle=BG; ctx.beginPath(); ctx.roundRect(0,0,w,h,8); ctx.fill();

    const gap=30, sx=22, sharedN=3;
    drawChain(ctx,sharedN,65,PURP,sx,gap);

    const splitX=sx+(sharedN-1)*gap;
    ctx.fillStyle=TXT; ctx.font='8px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('fork point',splitX,78);

    // Rantai baru
    const newY=110;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,newY);
    ctx.strokeStyle=PURP; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,newY,PURP,splitX+gap,gap);
    // Titik-titik lanjutan
    ctx.fillStyle=PURP;
    ctx.fillText('...', splitX+5*gap, newY);
    drawLabel(ctx,splitX+5*gap+8,newY,'New network',PURP);

    // Rantai lama — terus tumbuh sendiri
    const oldY=155;
    ctx.beginPath(); ctx.moveTo(splitX+11,65); ctx.lineTo(splitX+11,oldY);
    ctx.strokeStyle=RED; ctx.lineWidth=0.7; ctx.stroke();
    drawChain(ctx,4,oldY,RED,splitX+gap,gap);
    ctx.fillStyle=RED;
    ctx.fillText('...', splitX+5*gap, oldY);
    drawLabel(ctx,splitX+5*gap+8,oldY,'Old network',RED);

    // Label tidak kompatibel
    const midX=splitX+2*gap;
    ctx.strokeStyle=dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
    ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(midX,newY+8); ctx.lineTo(midX,oldY-8); ctx.stroke();
    ctx.fillStyle=TXT; ctx.font='8px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('incompatible',midX,(newY+oldY)/2);

    drawLabel(ctx,sx,185,'Permanent split — two networks',RED);
    drawLabel(ctx,sx,198,'Example: Bitcoin Cash (2017)',TXT);
  }

  function renderForks() {
    drawSoftFork();
    drawHardFork();
  }

  renderForks();

  if(typeof ResizeObserver!=='undefined'){
    const ro=new ResizeObserver(()=>requestAnimationFrame(renderForks));
    const sc=document.getElementById('b05-s51-fk-soft');
    const hc=document.getElementById('b05-s51-fk-hard');
    if(sc) ro.observe(sc);
    if(hc) ro.observe(hc);
  }
})();

// PAGE 8 · BAB 5 · 5.2 SIMULATION (Proof of Work)
// ============================================================
(function() {
  const DATA = 'Block #882419 | prev: 000000000000 | tx: 3a7b2c...';
  let diff = 2, nonce = 0, running = false, found = false;
  let startTime = 0, attempts = 0, rafId = null;

  async function sha256(buf) {
    return crypto.subtle.digest('SHA-256', buf instanceof ArrayBuffer ? buf : buf.buffer || buf);
  }
  async function sha256d(str) {
    const enc = new TextEncoder().encode(str);
    const h1  = await crypto.subtle.digest('SHA-256', enc);
    const h2  = await crypto.subtle.digest('SHA-256', h1);
    return Array.from(new Uint8Array(h2)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function g(id){ return document.getElementById(id); }

  function renderHash(hash, zeros, isFound) {
    const el = g('b05-s52-hash');
    if (!el) return;
    if (!hash || hash === '—') { el.innerHTML = '—'; el.className = 'pw-hash'; return; }
    el.innerHTML = `<span class="pw-zero">${hash.slice(0,zeros)}</span><span class="pw-rest">${hash.slice(zeros)}</span>`;
    el.className = 'pw-hash' + (isFound ? ' found' : '');
  }

  function updateStats() {
    const elapsed = (Date.now() - startTime) / 1000;
    const speed = elapsed > 0.1 ? Math.round(attempts / elapsed) : 0;
    const attEl = g('b05-s52-attempts');
    const spEl  = g('b05-s52-speed');
    if (attEl) attEl.textContent = attempts.toLocaleString('id');
    if (spEl)  spEl.textContent  = speed > 0 ? speed.toLocaleString('id') + '/s' : '—';
  }

  async function mineStep() {
    if (!running) return;
    const BATCH = 50;
    for (let i = 0; i < BATCH; i++) {
      const hash = await sha256d(DATA + '|nonce:' + nonce);
      attempts++;
      const nonceEl = g('b05-s52-nonce');
      if (nonceEl) nonceEl.textContent = nonce.toLocaleString('id');
      const target = '0'.repeat(diff);
      if (hash.startsWith(target)) {
        running = false; found = true;
        renderHash(hash, diff, true);
        updateStats();
        const stEl = g('b05-s52-status');
        if (stEl) stEl.textContent = 'found!';
        const res = g('b05-s52-result');
        if (res) {
          res.textContent = `Nonce ${nonce.toLocaleString('id')} found after ${attempts.toLocaleString('id')} attempts (${((Date.now()-startTime)/1000).toFixed(1)}s). The hash starts with ${diff} zeros — a valid proof of work.`;
          res.className = 'pw-result show ok';
        }
        return;
      }
      renderHash(hash, diff, false);
      nonce++;
    }
    updateStats();
    rafId = requestAnimationFrame(mineStep);
  }

  function startMining() {
    if (running || found) return;
    running = true; startTime = Date.now(); attempts = 0;
    const stEl = g('b05-s52-status');
    if (stEl) stEl.textContent = 'mining...';
    const res = g('b05-s52-result');
    if (res) { res.textContent = 'Searching for a valid nonce...'; res.className = 'pw-result show running'; }
    mineStep();
  }

  function reset() {
    running = false; found = false; nonce = 0; attempts = 0;
    if (rafId) cancelAnimationFrame(rafId);
    const nonceEl = g('b05-s52-nonce');
    const hashEl  = g('b05-s52-hash');
    const attEl   = g('b05-s52-attempts');
    const spEl    = g('b05-s52-speed');
    const stEl    = g('b05-s52-status');
    const res     = g('b05-s52-result');
    if (nonceEl) nonceEl.textContent = '0';
    if (hashEl)  { hashEl.innerHTML = '—'; hashEl.className = 'pw-hash'; }
    if (attEl)   attEl.textContent = '0';
    if (spEl)    spEl.textContent = '—';
    if (stEl)    stEl.textContent = 'ready';
    if (res)     res.className = 'pw-result';
  }

  const diffEl = g('b05-s52-diff');
  if (diffEl) diffEl.addEventListener('input', function() {
    diff = +this.value;
    const label = diff === 1 ? '1 zero' : `${diff} zeros`;
    const dv = g('b05-s52-diff-val');
    const tg = g('b05-s52-target');
    if (dv) dv.textContent = label;
    if (tg) tg.textContent = '0'.repeat(diff) + '...';
    reset();
  });

  const startBtn = g('b05-s52-start');
  const resetBtn = g('b05-s52-reset');
  if (startBtn) startBtn.addEventListener('click', startMining);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  // Init target display
  const tg = g('b05-s52-target');
  if (tg) tg.textContent = '00...';
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.3 SIMULATION (Block Anatomy)
// ============================================================
(function() {
  const PREV_HASH = '000000000000000000029abc3f4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2';

  const FIELDS = [
    { name:'Version', bytes:'4B', val:'00000020',
      desc:'The version of the Bitcoin software that created this block. Determines which validation rules apply.',
      note:'Rarely changes' },
    { name:'Previous block hash', bytes:'32B', val:PREV_HASH,
      desc:'The hash of the previous block. This is what connects one block to the next — that’s why it’s called a blockchain.',
      note:'What forms the chain', isChain:true },
    { name:'Merkle root', bytes:'32B', val:'7f3c1a2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      desc:'A single summary hash of all transaction hashes in this block. If one transaction changes, the merkle root changes too.',
      note:'One summary hash of all tx hashes, covered in 4.5' },
    { name:'Timestamp', bytes:'4B', val:'67a3bc14',
      desc:'The time the block was created, in Unix time format (seconds since 1 January 1970).',
      note:'Unix timestamp' },
    { name:'Bits (difficulty target)', bytes:'4B', val:'1703a30c',
      desc:'A compact representation of the current difficulty target. Determines how hard the puzzle the miner must solve is.',
      note:'Updated every 2016 blocks' },
    { name:'Nonce', bytes:'4B', val:'3850463748',
      desc:'The number the miner is searching for. The only field that changes during mining. The miner tries trillions of nonce values until a valid hash is found.',
      note:'What gets mined', isNonce:true },
  ];

  const chainHTML = `
    <div class="ba-chain-sim">
      <div class="ba-chain-block-sim">
        <div class="ba-chain-head-sim prev-sim">Previous block (#882418)</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
        <div class="ba-chain-row-sim hash-sim">hash: ${PREV_HASH.slice(0,20)}...</div>
      </div>
      <div class="ba-chain-arrow-sim">→</div>
      <div class="ba-chain-block-sim current-sim">
        <div class="ba-chain-head-sim curr-sim">This block (#882419)</div>
        <div class="ba-chain-row-sim match-sim">prev_hash: ${PREV_HASH.slice(0,20)}...</div>
        <div class="ba-chain-row-sim" style="color:#52524C;font-size:9px;padding:3px 8px;">... data ...</div>
      </div>
    </div>
    <div class="ba-chain-note-sim">prev_hash in this block = the hash of the previous block. That’s the chain.</div>`;

  const container = document.getElementById('b05-s53-fields');
  if (!container) return;
  let activeIdx = null;

  FIELDS.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'ba-field-sim' + (f.isNonce ? ' nonce-sim' : '');
    row.id = 'b05-s53-field-' + i;
    row.innerHTML = `
      <div class="ba-field-bytes-sim">${f.bytes}</div>
      <div class="ba-field-name-sim">${f.name}<span class="ba-field-note-sim">${f.note}</span></div>
      <div class="ba-field-arrow-sim">›</div>`;

    const detail = document.createElement('div');
    detail.className = 'ba-detail-sim';
    detail.id = 'b05-s53-detail-' + i;
    detail.innerHTML = `
      <div class="ba-detail-val-sim">${f.val}</div>
      <div class="ba-detail-desc-sim">${f.desc}</div>
      ${f.isChain ? chainHTML : ''}`;

    row.addEventListener('click', () => {
      if (activeIdx === i) {
        row.classList.remove('active');
        detail.classList.remove('show');
        activeIdx = null;
      } else {
        if (activeIdx !== null) {
          const prev = document.getElementById('b05-s53-field-' + activeIdx);
          const prevD = document.getElementById('b05-s53-detail-' + activeIdx);
          if (prev) prev.classList.remove('active');
          if (prevD) prevD.classList.remove('show');
        }
        row.classList.add('active');
        detail.classList.add('show');
        activeIdx = i;
      }
    });

    container.appendChild(row);
    container.appendChild(detail);
  });
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.5 SIMULATION (Halving Chart)
// ============================================================
(function() {
  function initHalvingChart() {
    const canvas = document.getElementById('b05-s55-chart');
    if (!canvas || !window.Chart) return;

    const halvings = [
      {year:2009,reward:50},{year:2012,reward:25},{year:2016,reward:12.5},
      {year:2020,reward:6.25},{year:2024,reward:3.125},{year:2028,reward:1.5625},
      {year:2032,reward:0.78125},{year:2036,reward:0.39},{year:2140,reward:0},
    ];

    const labels=[], rewards=[], supply=[];
    let cumulative=0;
    const seen=new Set();
    for(let i=0;i<halvings.length-1;i++){
      const h=halvings[i], next=halvings[i+1];
      const years=next.year-h.year;
      const btcPerYear=h.reward*52500;
      const steps=Math.min(5,years);
      for(let s=0;s<=steps;s++){
        const yr=Math.round(h.year+s*(years/steps));
        const added=btcPerYear*(s/steps)*years;
        if(!seen.has(yr)){
          seen.add(yr);
          labels.push(yr);
          rewards.push(+h.reward.toFixed(5));
          supply.push(Math.min(21000000,Math.round(cumulative+added)));
        }
      }
      cumulative+=btcPerYear*years;
    }
    if(!seen.has(2140)){labels.push(2140);rewards.push(0);supply.push(21000000);}

    const isDark=matchMedia('(prefers-color-scheme:dark)').matches;
    const gridC=isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)';
    const txtC =isDark?'#A0A098':'#3A3A35';

    new window.Chart(canvas, {
      type:'bar',
      data:{
        labels,
        datasets:[
          {
            type:'line', label:'Total supply (BTC)', data:supply,
            yAxisID:'y2', borderColor:'#3B6D11',
            backgroundColor:'rgba(59,109,17,0.07)',
            borderWidth:1.5, pointRadius:0, fill:true, tension:0.3,
            borderDash:[4,3], order:1,
          },
          {
            type:'bar', label:'Block reward (BTC)', data:rewards,
            yAxisID:'y1', backgroundColor:'#534AB7',
            borderRadius:2, borderSkipped:false,
            barPercentage:0.9, categoryPercentage:1, order:2,
          },
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        interaction:{mode:'index',intersect:false},
        plugins:{
          legend:{display:false},
          tooltip:{
            callbacks:{
              title:ctx=>'Year '+ctx[0].label,
              label:ctx=>{
                if(ctx.datasetIndex===0) return 'Supply: '+ctx.raw.toLocaleString('id')+' BTC';
                return 'Reward: '+ctx.raw+' BTC/block';
              }
            }
          },
        },
        scales:{
          x:{ticks:{color:txtC,font:{size:10},maxTicksLimit:10,autoSkip:true},grid:{color:gridC}},
          y1:{
            type:'linear',position:'left',
            title:{display:true,text:'Block reward (BTC)',color:txtC,font:{size:10}},
            ticks:{color:'#534AB7',font:{size:10}},
            grid:{color:gridC},
          },
          y2:{
            type:'linear',position:'right',
            title:{display:true,text:'Total supply (BTC)',color:txtC,font:{size:10}},
            ticks:{color:'#3B6D11',font:{size:10},callback:v=>v>=1000000?(v/1000000).toFixed(0)+'M':v},
            grid:{drawOnChartArea:false},
            max:21000000,
          },
        }
      }
    });
  }

  if (window.Chart) {
    initHalvingChart();
  } else {
    console.warn('Chart.js tidak tersedia; grafik dilewati.'); document.querySelectorAll('canvas').forEach(function(c){ if(c.getContext && !c.dataset.drawn){ var p=document.createElement('div'); p.style.cssText='font-family:Sora,sans-serif;font-size:11px;color:#854F0B;background:#FAEEDA;padding:10px 13px;border-radius:6px'; p.textContent='The chart could not be drawn because the charting library failed to load. The rest of the page is unaffected.'; if(c.parentNode) c.parentNode.insertBefore(p,c); } });
  }
})();

// ============================================================
// PAGE 8 · BAB 5 · 5.6 SIMULATION (Serangan 51%)
// ============================================================
(function() {
  let honest=3, attack=0, running=false, forked=false, animating=false;
  let intervalId=null, pct=30;
  const MAX_SHOW=18;

  function g(id){ return document.getElementById(id); }

  function renderBlocks() {
    const hEl=g('b05-s56-honest-blocks');
    const aEl=g('b05-s56-attack-blocks');
    if(!hEl||!aEl) return;
    const shared=Math.min(3,Math.min(honest,attack));

    // Honest
    let hHtml='';
    const hStart=Math.max(0,honest-MAX_SHOW);
    if(honest>MAX_SHOW) hHtml+=`<span style="font-size:10px;color:#52524C;margin-right:4px;">+${honest-MAX_SHOW}</span>`;
    for(let i=hStart;i<honest;i++){
      const cls='at-block-sim '+(i<shared?'shared-blk':'honest-blk'+(i===shared&&attack>0?' fork-pt':''));
      hHtml+=`<div class="${cls}">${i+1}</div>`;
    }
    hEl.innerHTML=hHtml;

    // Attack
    let aHtml='';
    const aStart=Math.max(0,attack-MAX_SHOW);
    if(attack>MAX_SHOW) aHtml+=`<span style="font-size:10px;color:#52524C;margin-right:4px;">+${attack-MAX_SHOW}</span>`;
    for(let i=aStart;i<attack;i++){
      const cls='at-block-sim '+(i<shared?'shared-blk':'attack-blk'+(i===shared?' fork-pt':''));
      aHtml+=`<div id="b05-s56-ab-${i}" class="${cls}">${i+1}</div>`;
    }
    aEl.innerHTML=aHtml;

    const hl=g('b05-s56-honest-len'); if(hl) hl.textContent=honest+' block';
    const al=g('b05-s56-attack-len'); if(al) al.textContent=attack+' block';
  }

  function updateStatus() {
    const st=g('b05-s56-status');
    const fb=g('b05-s56-fork');
    if(!st) return;
    if(forked){
      st.className='at-status-sim forked-sim';
      st.textContent='✅ The hashing algorithm has been changed. The attacker’s chain is invalid. All the attacker’s ASIC hardware is instantly useless. The network is safe again.';
      if(fb) fb.style.display='none';
      return;
    }
    if(pct<50){
      st.className='at-status-sim safe-sim';
      st.textContent=`✅ The attacker (${pct}% hashrate) can’t catch up. The probability of success approaches zero the longer the honest chain gets.`;
      if(fb) fb.style.display='none';
    } else if(attack<=honest){
      st.className='at-status-sim danger-sim';
      st.textContent=`⚠️ The attacker (${pct}% hashrate) is catching up — ${honest-attack} blocks behind. A real threat.`;
      if(fb) fb.style.display='none';
    } else {
      st.className='at-status-sim attacking-sim';
      st.textContent=`🚨 Attack succeeded — the attacker’s chain is ${attack-honest} blocks longer. A double-spend can be performed.`;
      if(fb) fb.style.display='inline-flex';
    }
  }

  function step(){
    if(!running||animating) return;
    if(Math.random()*100<pct) attack++;
    else honest++;
    renderBlocks();
    updateStatus();
    if(honest>=40||attack>=40){ running=false; clearInterval(intervalId); }
  }

  async function doFork(){
    if(animating) return;
    running=false; clearInterval(intervalId);
    animating=true;
    const fb=g('b05-s56-fork');
    if(fb) fb.disabled=true;
    while(attack>0){
      const aEl=g('b05-s56-attack-blocks');
      const last=aEl?aEl.lastElementChild:null;
      if(last&&last.classList.contains('at-block-sim')) last.classList.add('dying');
      await new Promise(r=>setTimeout(r,80));
      attack--;
      renderBlocks();
      const al=g('b05-s56-attack-len');
      if(al) al.textContent=attack+' block';
    }
    forked=true; animating=false;
    updateStatus();
    if(fb){ fb.disabled=false; fb.style.display='none'; }
  }

  function reset(){
    running=false; forked=false; animating=false;
    clearInterval(intervalId);
    honest=3; attack=0;
    renderBlocks();
    const st=g('b05-s56-status');
    if(st){st.className='at-status-sim safe-sim';st.textContent='Set the attacker hashrate and click Start to see the race attack.';}
    const fb=g('b05-s56-fork');
    if(fb){fb.style.display='none';fb.disabled=false;}
  }

  const slider=g('b05-s56-slider');
  if(slider) slider.addEventListener('input',function(){
    pct=+this.value;
    const pv=g('b05-s56-pct');
    if(pv) pv.textContent=pct+'%';
    reset();
  });
  const startBtn=g('b05-s56-start');
  const forkBtn =g('b05-s56-fork');
  const resetBtn=g('b05-s56-reset');
  if(startBtn) startBtn.addEventListener('click',()=>{ if(running||animating) return; running=true; intervalId=setInterval(step,180); });
  if(forkBtn)  forkBtn.addEventListener('click',doFork);
  if(resetBtn) resetBtn.addEventListener('click',reset);

  renderBlocks();
})();

