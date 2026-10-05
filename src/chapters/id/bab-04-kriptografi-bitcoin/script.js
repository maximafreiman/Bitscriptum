// ============================================================
// PAGE 7 · BAB 4 · TOPBAR & BACK EVENTS
// ============================================================
document.getElementById('back-home-b4').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b4').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 7 · BAB 4 · SUB-BAB NAVIGATION
// ============================================================
function showSectionInContentB4(sectionId, sbId) {
  document.querySelectorAll('#page-bab4 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab4 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab4-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
  // Redraw canvas simulasi jika section 4.5 dibuka
  if (sectionId === 'section-4-5') {
    requestAnimationFrame(() => {
      const c = document.getElementById('b04-s45-canvas');
      if (c) c.dispatchEvent(new Event('mt-redraw'));
    });
  }
}

// tombol nav Bab 4
document.querySelectorAll('#page-bab4 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB4(target, sb);
  });
});

// ============================================================
// PAGE 7 · BAB 4 · SIDEBAR EVENTS (4.1 - 4.6)
// ============================================================
document.getElementById('sb-4-1').addEventListener('click', () => showSectionInContentB4('section-4-1', 'sb-4-1'));
document.getElementById('sb-4-2').addEventListener('click', () => showSectionInContentB4('section-4-2', 'sb-4-2'));
document.getElementById('sb-4-3').addEventListener('click', () => showSectionInContentB4('section-4-3', 'sb-4-3'));
document.getElementById('sb-4-4').addEventListener('click', () => showSectionInContentB4('section-4-4', 'sb-4-4'));
document.getElementById('sb-4-5').addEventListener('click', () => showSectionInContentB4('section-4-5', 'sb-4-5'));
document.getElementById('sb-4-6').addEventListener('click', () => showSectionInContentB4('section-4-6', 'sb-4-6'));

// PAGE 7 · BAB 4 · 4.1 SIMULATION (Hash Playground + Hash Comparison)
// ============================================================
(function() {
  async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function diffCount(a, b) {
    let d = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i] !== b[i]) d++; }
    return d;
  }

  function highlightDiff(a, b) {
    return a.split('').map((c, i) =>
      b[i] !== c ? `<span style="background:#534AB7;color:#fff;border-radius:2px;padding:0 1px">${c}</span>` : c
    ).join('');
  }

  let lastHash = '';
  let debounceTimer = null;

  async function updateHash(val) {
    const hashEl  = document.getElementById('b04-s41-hash');
    const lenEl   = document.getElementById('b04-s41-len');
    const avBody  = document.getElementById('b04-s41-av-body');
    if (!hashEl || !lenEl || !avBody) return;

    lenEl.textContent = val.length;

    if (!val) {
      hashEl.textContent = 'Ketik sesuatu untuk melihat hash-nya...';
      hashEl.className   = 'hp-hash-val hp-hash-empty';
      lastHash = '';
      avBody.innerHTML = '<div style="font-size:12px;color:#52524C;">Ketik sesuatu di atas untuk melihat perbandingan dengan versi yang berbeda satu huruf.</div>';
      updateComparison('');
      return;
    }

    const hash = await sha256(val);

    if (hash !== lastHash && lastHash) {
      hashEl.classList.add('changed');
      setTimeout(() => hashEl.classList.remove('changed'), 600);
    }

    hashEl.textContent = hash;
    hashEl.className   = 'hp-hash-val';
    lastHash = hash;

    // Avalanche demo
    const altVal  = val.slice(0, -1) + String.fromCharCode(val.charCodeAt(val.length - 1) + 1);
    const altHash = await sha256(altVal);
    const diff    = diffCount(hash, altHash);
    const pct     = Math.round(diff / 64 * 100);
    const shared  = val.slice(0, -1);
    const origC   = val.slice(-1);
    const altC    = altVal.slice(-1);

    avBody.innerHTML = `
      <div class="hp-av-row">
        <div class="hp-av-input">"${shared}<span>${origC}</span>"</div>
        <div class="hp-av-hash a">${highlightDiff(hash, altHash)}</div>
      </div>
      <div class="hp-av-row">
        <div class="hp-av-input">"${shared}<span>${altC}</span>" <span style="font-size:10px;color:#52524C;">(1 karakter berbeda)</span></div>
        <div class="hp-av-hash b">${highlightDiff(altHash, hash)}</div>
      </div>
      <div class="hp-av-diff">
        <strong>${diff} dari 64 karakter berbeda</strong> (${pct}%), satu perubahan kecil, hash berubah hampir setengahnya.
      </div>`;

    updateComparison(val);
  }

  // Hash comparison — SHA-256 dan SHA-256d via Web Crypto, Hash160 via RIPEMD-160 RFC 2286
  function ripemd160(msgBytes) {
    function rotl(x,n){return((x<<n)|(x>>>(32-n)))>>>0;}
    function f(x,y,z){return(x^y^z)>>>0;}
    function g(x,y,z){return((x&y)|(~x&z))>>>0;}
    function h(x,y,z){return((x|~y)^z)>>>0;}
    function i(x,y,z){return((x&z)|(y&~z))>>>0;}
    function j(x,y,z){return(x^(y|~z))>>>0;}
    const msg=Array.from(msgBytes),origLen=msg.length;
    msg.push(0x80);
    while(msg.length%64!==56)msg.push(0x00);
    const bl=origLen*8;
    for(let k=0;k<4;k++)msg.push((bl>>>(k*8))&0xff);
    for(let k=0;k<4;k++)msg.push(0x00);
    let h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0;
    const KL=[0x00000000,0x5A827999,0x6ED9EBA1,0x8F1BBCDC,0xA953FD4E];
    const KR=[0x50A28BE6,0x5C4DD124,0x6D703EF3,0x7A6D76E9,0x00000000];
    const RL=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
    const RR=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
    const SL=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
    const SR=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
    for(let blk=0;blk<msg.length;blk+=64){
      const W=[];
      for(let t=0;t<16;t++)W[t]=(msg[blk+t*4])|(msg[blk+t*4+1]<<8)|(msg[blk+t*4+2]<<16)|(msg[blk+t*4+3]<<24);
      let al=h0,bl2=h1,cl=h2,dl=h3,el=h4,ar=h0,br=h1,cr=h2,dr=h3,er=h4;
      for(let t=0;t<80;t++){
        const r=Math.floor(t/16);
        const FL=[f,g,h,i,j][r],FR=[j,i,h,g,f][r];
        let tl=(rotl((al+FL(bl2,cl,dl)+W[RL[t]]+KL[r])>>>0,SL[t])+el)>>>0;
        al=el;el=dl;dl=rotl(cl,10)>>>0;cl=bl2;bl2=tl;
        let tr=(rotl((ar+FR(br,cr,dr)+W[RR[t]]+KR[r])>>>0,SR[t])+er)>>>0;
        ar=er;er=dr;dr=rotl(cr,10)>>>0;cr=br;br=tr;
      }
      const tmp=(h1+cl+dr)>>>0;h1=(h2+dl+er)>>>0;h2=(h3+el+ar)>>>0;
      h3=(h4+al+br)>>>0;h4=(h0+bl2+cr)>>>0;h0=tmp;
    }
    function le32(x){return[x&0xff,(x>>>8)&0xff,(x>>>16)&0xff,(x>>>24)&0xff];}
    return [...le32(h0),...le32(h1),...le32(h2),...le32(h3),...le32(h4)]
      .map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  async function updateComparison(val) {
    const el256   = document.getElementById('b04-s41-cmp-sha256');
    const el256d  = document.getElementById('b04-s41-cmp-sha256d');
    const el160   = document.getElementById('b04-s41-cmp-hash160');
    if (!val) {
      if (el256)  el256.textContent  = '—';
      if (el256d) el256d.textContent = '—';
      if (el160)  el160.textContent  = '—';
      return;
    }
    // SHA-256 via Web Crypto (akurat)
    const buf1 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
    const h1   = Array.from(new Uint8Array(buf1)).map(b=>b.toString(16).padStart(2,'0')).join('');
    // SHA-256d: SHA-256 lagi dari hasil pertama
    const buf2 = await crypto.subtle.digest('SHA-256', new Uint8Array(buf1));
    const h1d  = Array.from(new Uint8Array(buf2)).map(b=>b.toString(16).padStart(2,'0')).join('');
    // Hash160: RIPEMD-160 dari hasil SHA-256 (RFC 2286)
    const h160 = ripemd160(new Uint8Array(buf1));
    if (el256)  el256.textContent  = h1;
    if (el256d) el256d.textContent = h1d;
    if (el160)  el160.textContent  = h160;
  }

  const inp = document.getElementById('b04-s41-input');
  if (inp) {
    inp.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => updateHash(this.value), 80);
    });
  }

  for (let i = 0; i <= 5; i++) {
    const btn = document.getElementById('b04-s41-pr-' + i);
    if (btn) btn.addEventListener('click', () => {
      const input = document.getElementById('b04-s41-input');
      if (input) { input.value = btn.getAttribute('data-text'); updateHash(input.value); }
    });
  }
})();


// PAGE 7 · BAB 4 · 4.2 SIMULATION (Elliptic Curve)
// ============================================================
(function() {
  const canvas = document.getElementById('b04-s42-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const isDark = matchMedia('(prefers-color-scheme: dark)').matches;

  const BG     = isDark ? '#1A1A18' : '#F4F4F0';
  const CURVE  = isDark ? '#3C3489' : '#C4B5FD';
  const GRID   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const GCOL   = '#3B6D11';
  const PUBCOL = '#534AB7';
  const PTCOL  = '#534AB7';
  const LINECOL= isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)';

  function curveY(x) {
    const y2 = x*x*x - x + 1;
    return y2 >= 0 ? Math.sqrt(y2) : NaN;
  }

  let W, H, cx, cy, scale;
  function setup() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width * dpr; H = 300 * dpr;
    canvas.width = W; canvas.height = H;
    cx = W*0.5; cy = H*0.5; scale = W*0.10;
  }
  function toCanvas(x, y) { return [cx + x*scale, cy - y*scale]; }

  const XS = [-2.2,-1.8,-1.2,-0.5,0.2,0.8,1.4,1.9,2.3,
               -2.0,-1.5,-0.8,0.0,0.6,1.1,1.7,2.1,
               -1.9,-1.3,-0.6,0.3,0.9,1.5,2.0,
               -2.1,-1.6,-0.9,0.1,0.7,1.2,1.8,2.2];

  function getPoints(k) {
    const pts = [];
    for (let i = 0; i < k; i++) {
      const x  = XS[i % XS.length];
      const yv = curveY(x);
      if (isNaN(yv) || yv === 0) continue;
      const sign = (Math.floor(i * 1.618) % 2 === 0) ? 1 : -1;
      pts.push([x, sign * yv]);
    }
    // Fallback: pastikan minimal 1 titik selalu ada
    if (pts.length === 0) pts.push([-1.2, curveY(-1.2)]);
    return pts;
  }

  function xorshift(s) {
    s = (s || 1) >>> 0;
    s ^= s << 13; s = s >>> 0;
    s ^= s >> 17;
    s ^= s << 5;  s = s >>> 0;
    return s;
  }

  function coordToHex(x, y, bytes) {
    let s = ((Math.abs(x) * 1e6) ^ (Math.abs(y) * 1e4) * 137) >>> 0;
    s = s || 0xdeadbeef;
    let hex = '';
    for (let i = 0; i < bytes; i++) {
      s = xorshift(s ^ (i * 0x9e3779b9));
      hex += (s & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }

  function draw(k) {
    setup();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12*dpr); ctx.fill();

    ctx.strokeStyle = GRID; ctx.lineWidth = 0.5;
    for (let x=-4;x<=4;x++){const[px]=toCanvas(x,0);ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.stroke();}
    for (let y=-3;y<=3;y++){const[,py]=toCanvas(0,y);ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(W,py);ctx.stroke();}

    ctx.strokeStyle=isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)'; ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(toCanvas(-4,0)[0],cy);ctx.lineTo(toCanvas(4,0)[0],cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,toCanvas(0,-3)[1]);ctx.lineTo(cx,toCanvas(0,3)[1]);ctx.stroke();

    ctx.strokeStyle=CURVE; ctx.lineWidth=2;
    for (const sign of [1,-1]) {
      ctx.beginPath(); let first=true;
      for (let xi=-240;xi<=240;xi++){
        const x=xi/80, yv=curveY(x);
        if(isNaN(yv)){first=true;continue;}
        const[px,py]=toCanvas(x,sign*yv);
        if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);
      }
      ctx.stroke();
    }

    const pts = getPoints(k);

    ctx.strokeStyle=LINECOL; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    for(let i=0;i<pts.length-1;i++){
      const[x1,y1]=toCanvas(pts[i][0],pts[i][1]);
      const[x2,y2]=toCanvas(pts[i+1][0],pts[i+1][1]);
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    }
    ctx.setLineDash([]);

    for(let i=1;i<pts.length-1;i++){
      const[px,py]=toCanvas(pts[i][0],pts[i][1]);
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
      ctx.fillStyle=PTCOL;ctx.globalAlpha=0.35;ctx.fill();ctx.globalAlpha=1;
    }

    if (pts.length === 0) return;

    const[gx,gy]=toCanvas(pts[0][0],pts[0][1]);
    ctx.beginPath();ctx.arc(gx,gy,7,0,Math.PI*2);
    ctx.fillStyle=GCOL;ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font=`500 ${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('G',gx,gy);
    ctx.fillStyle=GCOL;
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='left';ctx.textBaseline='bottom';
    ctx.fillText('G (titik awal)',gx+10*dpr,gy-6*dpr);

    const last=pts[pts.length-1];
    const[lx,ly]=toCanvas(last[0],last[1]);
    ctx.beginPath();ctx.arc(lx,ly,9,0,Math.PI*2);
    ctx.fillStyle=PUBCOL;ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font=`500 ${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('P',lx,ly);

    const labelSide=lx>W*0.72?'right':'left';
    ctx.fillStyle=isDark?'#C4B5FD':'#534AB7';
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign=labelSide;ctx.textBaseline='bottom';
    ctx.fillText('Public key',lx+(labelSide==='right'?-12:12)*dpr,ly-6*dpr);

    ctx.fillStyle=isDark?'rgba(196,181,253,0.6)':'rgba(83,74,183,0.5)';
    ctx.font=`${Math.round(10*dpr)}px sans-serif`;
    ctx.textAlign='right';ctx.textBaseline='top';
    ctx.fillText(`${k} lompatan`,W-8*dpr,8*dpr);

    const px=last[0], py=last[1];
    const privEl  = document.getElementById('b04-s42-priv');
    const coordEl = document.getElementById('b04-s42-coord');
    const pubEl   = document.getElementById('b04-s42-pub');
    const subEl   = document.getElementById('b04-s42-pub-sub');
    const noteEl  = document.getElementById('b04-s42-note');

    if (privEl)  privEl.textContent  = `${k} lompatan`;
    if (coordEl) coordEl.textContent = `(${px.toFixed(6)},  ${py.toFixed(6)})`;

    const prefix = py >= 0 ? '02' : '03';
    const xHex   = coordToHex(px, py, 32);
    if (pubEl) pubEl.innerHTML = `<span class="ecc-prefix">${prefix}</span>${xHex}`;

    const sign = py >= 0 ? 'positif' : 'negatif';
    if (subEl) subEl.innerHTML =
      `Prefix <span class="ecc-prefix">${prefix}</span> karena y ${sign} (${py.toFixed(4)}). ` +
      `Hanya koordinat x yang disimpan dalam hex. Penerima bisa menghitung ulang y dari x dan prefix ini.`;

    if (noteEl) noteEl.textContent = k === 1
      ? 'Private key = 1. Titik akhir adalah G itu sendiri.'
      : `Private key = ${k}. Dari public key ini, tidak ada cara menemukan berapa lompatan yang dilakukan. Coba tambah atau kurangi 1 — seluruh public key berubah total.`;
  }

  let k = 7;
  draw(k);

  const slider = document.getElementById('b04-s42-slider');
  if (slider) slider.addEventListener('input', function() {
    k = +this.value;
    const kEl = document.getElementById('b04-s42-k');
    if (kEl) kEl.textContent = k;
    draw(k);
  });

  window.addEventListener('resize', () => draw(k));
})();

// PAGE 7 · BAB 4 · 4.3 SIMULATION (ECDSA)
// ============================================================
(function() {
  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function strSeed(str){let s=0x811c9dc5;for(let i=0;i<str.length;i++){s^=str.charCodeAt(i);s=Math.imul(s,0x01000193)>>>0;}return s;}

  let state={msg:'',priv:'',nonce:'',sig:'',pub:'',origMsg:'',origSig:'',signed:false};

  function g(id){return document.getElementById(id);}

  function resetAll(){
    state={msg:'',priv:'',nonce:'',sig:'',pub:'',origMsg:'',origSig:'',signed:false};
    const msgEl=g('b04-s43-msg');if(msgEl)msgEl.value='Kirim 0.05 BTC ke bc1q...3f8a';
    const wrap=g('b04-s43-sign-wrap');if(wrap)wrap.style.display='none';
    ['b04-s43-priv','b04-s43-nonce','b04-s43-sig','b04-s43-v-sig','b04-s43-v-pub'].forEach(id=>{const el=g(id);if(el)el.textContent='—';});
    const vm=g('b04-s43-v-msg');if(vm)vm.textContent='Selesaikan Tahap 1 terlebih dahulu.';
    const tm=g('b04-s43-t-msg-val');if(tm)tm.textContent='Selesaikan Tahap 1 terlebih dahulu.';
    const ts=g('b04-s43-t-sig-val');if(ts)ts.textContent='—';
    const vr=g('b04-s43-v-result');if(vr)vr.className='ec-result';
    const tr=g('b04-s43-t-result');if(tr)tr.className='ec-result';
  }

  function sign(){
    const msgEl=g('b04-s43-msg');
    if(!msgEl) return;
    const msg=msgEl.value.trim();
    if(!msg) return;
    const seed=strSeed(msg+Date.now());
    const priv=makeHex(seed,32);
    const nonce=makeHex(xorshift(seed),32);
    const pub='02'+makeHex(xorshift(seed^0xabcdef),32);
    const rs=strSeed(msg+priv+nonce);
    const r=makeHex(rs,32);
    const s=makeHex(xorshift(rs),32);
    const sig=r+s;
    state={msg,priv,nonce,sig,pub,origMsg:msg,origSig:sig,signed:true};
    const privEl=g('b04-s43-priv');if(privEl)privEl.textContent=priv;
    const nonceEl=g('b04-s43-nonce');if(nonceEl)nonceEl.textContent=nonce;
    const sigEl=g('b04-s43-sig');if(sigEl)sigEl.textContent=sig;
    const wrap=g('b04-s43-sign-wrap');if(wrap)wrap.style.display='block';
    const vm=g('b04-s43-v-msg');if(vm)vm.textContent=msg;
    const vs=g('b04-s43-v-sig');if(vs)vs.textContent=sig;
    const vp=g('b04-s43-v-pub');if(vp)vp.textContent=pub;
    const vr=g('b04-s43-v-result');if(vr)vr.className='ec-result';
    const tm=g('b04-s43-t-msg-val');if(tm)tm.textContent=msg;
    const ts=g('b04-s43-t-sig-val');if(ts)ts.textContent=sig;
    const tr=g('b04-s43-t-result');if(tr)tr.className='ec-result';
  }

  function verify(msgId,sigId,resultId){
    const el=g(resultId);if(!el)return;
    if(!state.signed){
      el.className='ec-result bad show';
      el.textContent='Belum ada tanda tangan. Selesaikan Tahap 1 terlebih dahulu.';
      return;
    }
    const msgEl=g(msgId);const sigEl=g(sigId);
    if(!msgEl||!sigEl)return;
    const ok=(msgEl.textContent===state.origMsg)&&(sigEl.textContent===state.origSig);
    el.className='ec-result show '+(ok?'ok':'bad');
    el.textContent=ok
      ?'✓ Tanda tangan valid. Pesan tidak dimodifikasi dan tanda tangan cocok dengan public key pengirim. Jaringan menerima transaksi ini.'
      :'✗ Tanda tangan tidak valid. Pesan atau tanda tangan telah dimodifikasi. Jaringan menolak transaksi ini seketika.';
  }

  // Tamper buttons
  const tMsg=g('b04-s43-t-msg');
  if(tMsg)tMsg.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-msg-val');if(el)el.textContent=state.origMsg.replace('0.05','0.50');
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tAddr=g('b04-s43-t-addr');
  if(tAddr)tAddr.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-msg-val');if(el)el.textContent=state.origMsg.replace('bc1q...3f8a','bc1q...9z99');
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tSig=g('b04-s43-t-sig');
  if(tSig)tSig.addEventListener('click',()=>{
    if(!state.signed)return;
    const el=g('b04-s43-t-sig-val');if(el)el.textContent='ff'+state.origSig.slice(2);
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });
  const tReset=g('b04-s43-t-reset');
  if(tReset)tReset.addEventListener('click',()=>{
    if(!state.signed)return;
    const m=g('b04-s43-t-msg-val');if(m)m.textContent=state.origMsg;
    const s=g('b04-s43-t-sig-val');if(s)s.textContent=state.origSig;
    const r=g('b04-s43-t-result');if(r)r.className='ec-result';
  });

  // Tab switching
  [1,2,3].forEach(i=>{
    const tab=g('b04-s43-tab-'+i);
    if(tab)tab.addEventListener('click',()=>{
      [1,2,3].forEach(j=>{
        const t=g('b04-s43-tab-'+j);const p=g('b04-s43-panel-'+j);
        if(t)t.className='ec-step-tab'+(j===i?' active':'');
        if(p)p.className='ec-panel'+(j===i?' show':'');
      });
    });
  });

  const btnSign=g('b04-s43-btn-sign');
  const btnReset=g('b04-s43-btn-reset');
  const btnVerify=g('b04-s43-btn-verify');
  const btnTV=g('b04-s43-btn-t-verify');

  // DER encoding builder
  function buildDER(sig, pub) {
    if (!sig || sig.length < 128) return null;
    const r = sig.slice(0, 64);
    const s = sig.slice(64, 128);
    // DER format: 0x30 [total-len] 0x02 [r-len] [r] 0x02 [s-len] [s]
    // Prefix 00 if high bit set (ambiguity prevention)
    const rPadded = parseInt(r.slice(0,2),16) >= 0x80 ? '00'+r : r;
    const sPadded = parseInt(s.slice(0,2),16) >= 0x80 ? '00'+s : s;
    const rLen = (rPadded.length/2).toString(16).padStart(2,'0');
    const sLen = (sPadded.length/2).toString(16).padStart(2,'0');
    const inner = '02'+rLen+rPadded+'02'+sLen+sPadded;
    const totalLen = (inner.length/2).toString(16).padStart(2,'0');
    const der = '30'+totalLen+inner;
    const derWithSighash = der + '01'; // SIGHASH_ALL
    return { r, s, rPadded, sPadded, rLen, sLen, der, derWithSighash, pub };
  }

  function renderDER(d) {
    if (!d) return 'Tanda tangani transaksi di Tahap 1 terlebih dahulu.';
    return `<span class="raw-comment">// ECDSA signature dalam format DER (Distinguished Encoding Rules)</span>
<span class="raw-comment">// Ini yang masuk ke dalam scriptSig atau witness field transaksi Bitcoin</span>

<span class="raw-comment">// Struktur DER:</span>
<span class="raw-key">30</span>                    <span class="raw-comment">// marker: ini DER sequence</span>
<span class="raw-key">${(d.der.length/2-1).toString(16).padStart(2,'0')}</span>                    <span class="raw-comment">// total length: ${d.der.length/2-1} bytes</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (nilai r)</span>
  <span class="raw-key">${d.rLen}</span>                  <span class="raw-comment">// r length: ${parseInt(d.rLen,16)} bytes${d.rPadded.length>64?' (diawali 00 karena high bit set)':''}</span>
  <span class="raw-num">${d.rPadded}</span>  <span class="raw-comment">// r</span>
  <span class="raw-key">02</span>                  <span class="raw-comment">// marker: integer (nilai s)</span>
  <span class="raw-key">${d.sLen}</span>                  <span class="raw-comment">// s length: ${parseInt(d.sLen,16)} bytes${d.sPadded.length>64?' (diawali 00 karena high bit set)':''}</span>
  <span class="raw-num">${d.sPadded}</span>  <span class="raw-comment">// s</span>
<span class="raw-key">01</span>                    <span class="raw-comment">// SIGHASH_ALL: tanda tangan mencakup seluruh transaksi</span>

<span class="raw-comment">// Hasil akhir (DER + sighash flag):</span>
<span class="raw-str">${d.derWithSighash}</span>

<span class="raw-comment">// Public key (compressed, 33 bytes):</span>
<span class="raw-str">${d.pub ? d.pub.slice(0,66) : '—'}</span>

<span class="raw-comment">// Keduanya masuk ke witness field (SegWit) atau scriptSig (Legacy).</span>
<span class="raw-comment">// Total signature size: ~${Math.round(d.derWithSighash.length/2)} bytes</span>
<span class="raw-comment">// Catatan: setiap tanda tangan ECDSA berbeda ukurannya (71-73 bytes)</span>
<span class="raw-comment">// karena r dan s bisa membutuhkan padding 0x00 atau tidak.</span>`;
  }

  const rawBtn43   = g('b04-s43-raw-btn');
  const rawPanel43 = g('b04-s43-raw-panel');
  const rawBody43  = g('b04-s43-raw-body');
  let rawOpen43 = false;
  let lastDER   = null;

  function updateRaw43() {
    if (rawOpen43 && rawBody43) rawBody43.innerHTML = renderDER(lastDER);
  }

  if (rawBtn43) rawBtn43.addEventListener('click', () => {
    rawOpen43 = !rawOpen43;
    rawBtn43.classList.toggle('active', rawOpen43);
    rawBtn43.innerHTML = rawOpen43
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if (rawOpen43 && rawPanel43) { rawPanel43.classList.add('show'); updateRaw43(); }
    else if (rawPanel43) rawPanel43.classList.remove('show');
  });

  // Hook ke sign function — update DER setiap kali sign
  const origSign43 = sign;
  function signWithRaw() {
    origSign43();
    // Ambil sig dan pub yang baru di-set
    setTimeout(() => {
      const sigEl = g('b04-s43-sig');
      const pubEl = g('b04-s43-v-pub');
      if (sigEl && pubEl) {
        lastDER = buildDER(sigEl.textContent, pubEl.textContent);
        updateRaw43();
      }
    }, 50);
  }

  if(btnSign)  btnSign.addEventListener('click', signWithRaw);
  if(btnReset) btnReset.addEventListener('click', () => { resetAll(); lastDER=null; updateRaw43(); });
  if(btnVerify)btnVerify.addEventListener('click',()=>verify('b04-s43-v-msg','b04-s43-v-sig','b04-s43-v-result'));
  if(btnTV)    btnTV.addEventListener('click',()=>verify('b04-s43-t-msg-val','b04-s43-t-sig-val','b04-s43-t-result'));
})();

// PAGE 7 · BAB 4 · 4.4 SIMULATION (Schnorr)
// ============================================================
(function() {
  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function short(hex){return hex.slice(0,8)+'...';}

  function currentSigners(){
    const sl=document.getElementById('b04-s44-signers');
    return sl ? parseInt(sl.value,10) : 3;
  }
  function buildTxs(){
    const n=currentSigners();
    return [
      {label:'Tx #1', signers:1, amount:'0.050 BTC'},
      {label:'Tx #2', signers:n, amount:'0.320 BTC'},
      {label:'Tx #3', signers:2, amount:'1.200 BTC'},
    ];
  }  // Ukuran nyata: ECDSA DER 71-72 byte per tanda tangan, Schnorr tetap 64 byte
  // berapapun jumlah penandatangan, karena MuSig menggabungkannya jadi satu.
  const SIG_ECDSA = 72, SIG_SCHNORR = 64, FEE_RATE = 20; // sat/vB
  const MAX_SIGNERS = 15;

  function fmtSat(n){ return n.toLocaleString('id-ID'); }

  function renderAgg(){
    const sl = document.getElementById('b04-s44-signers');
    if(!sl) return;
    const n = parseInt(sl.value, 10);
    const eBytes = n * SIG_ECDSA;
    const sBytes = SIG_SCHNORR;
    const maxBytes = MAX_SIGNERS * SIG_ECDSA;

    const lbl = document.getElementById('b04-s44-signers-val');
    if(lbl) lbl.textContent = n + ' dari ' + n;

    const be = document.getElementById('b04-s44-bar-e');
    const bs = document.getElementById('b04-s44-bar-s');
    if(be) be.style.width = Math.max(2, (eBytes / maxBytes) * 100) + '%';
    if(bs) bs.style.width = Math.max(2, (sBytes / maxBytes) * 100) + '%';

    const ve = document.getElementById('b04-s44-val-e');
    const vs = document.getElementById('b04-s44-val-s');
    if(ve) ve.textContent = n + ' sig \u00b7 ' + eBytes + ' byte';
    if(vs) vs.textContent = '1 sig \u00b7 ' + sBytes + ' byte';

    const v = document.getElementById('b04-s44-verdict');
    if(v){
      if(n === 1){
        v.innerHTML = 'Dengan satu penandatangan, selisihnya tipis: <b>72 byte lawan 64 byte</b>. Geser ke kanan untuk melihat apa yang terjadi begitu penandatangannya bertambah.';
      } else {
        const hemat = eBytes - sBytes;
        const feeHemat = Math.round(hemat / 4) * FEE_RATE; // witness didiskon 4x
        v.innerHTML = 'ECDSA menyimpan <b>' + n + ' tanda tangan</b> terpisah, jadi ukurannya ikut tumbuh. Schnorr menggabungkan ' + n + ' tanda tangan menjadi <b>satu</b>, dan tetap 64 byte. Hemat <b>' + hemat + ' byte</b>, atau sekitar <b>' + fmtSat(feeHemat) + ' satoshi</b> pada fee rate 20 sat/vB. Dan karena hasilnya cuma satu tanda tangan, tidak ada yang bisa menebak bahwa transaksi ini melibatkan ' + n + ' orang.';
      }
    }
    render();
  }


  function render(){
    const eBody=document.getElementById('b04-s44-e-body');
    const sBody=document.getElementById('b04-s44-s-body');
    if(!eBody||!sBody) return;
    eBody.innerHTML=''; sBody.innerHTML='';

    buildTxs().forEach((tx,ti)=>{
      const txid=short(makeHex((ti+1)*0x1234abcd,16));
      const inp =short(makeHex((ti+1)*0xdeadbeef,16));
      const sigs=[];
      for(let i=0;i<tx.signers;i++) sigs.push(short(makeHex((ti*10+i+1)*0xcafe1234,32)));
      const aggSig=short(makeHex((ti+1)*0x9a8b7c6d,32));

      // ECDSA card
      let eSigRows='';
      sigs.forEach((s,i)=>{eSigRows+=`<div class="sc-tx-row"><span class="sc-tx-key">sig[${i+1}]</span><span class="sc-tx-val red">${s}</span></div>`;});
      const eBadge=tx.signers>1
        ?`<span class="sc-tx-head-badge multi">multisig ${tx.signers}×</span>`
        :`<span class="sc-tx-head-badge single">1 tanda tangan</span>`;
      eBody.innerHTML+=`
        <div class="sc-tx e">
          <div class="sc-tx-head e"><span class="sc-tx-head-id">${tx.label} · ${txid}</span>${eBadge}</div>
          <div class="sc-tx-body">
            <div class="sc-tx-row"><span class="sc-tx-key">input</span><span class="sc-tx-val">${inp}</span></div>
            <hr class="sc-tx-divider">
            ${eSigRows}
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">amount</span><span class="sc-tx-val">${tx.amount}</span></div>
          </div>
        </div>`;

      // Schnorr card
      sBody.innerHTML+=`
        <div class="sc-tx s">
          <div class="sc-tx-head s"><span class="sc-tx-head-id">${tx.label} · ${txid}</span><span class="sc-tx-head-badge unknown">1 tanda tangan</span></div>
          <div class="sc-tx-body">
            <div class="sc-tx-row"><span class="sc-tx-key">input</span><span class="sc-tx-val">${inp}</span></div>
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">sig</span><span class="sc-tx-val purple">${aggSig}</span></div>
            <hr class="sc-tx-divider">
            <div class="sc-tx-row"><span class="sc-tx-key">amount</span><span class="sc-tx-val">${tx.amount}</span></div>
          </div>
        </div>`;
    });

    const eObs=document.getElementById('b04-s44-e-obs');
    const sObs=document.getElementById('b04-s44-s-obs');
    const note=document.getElementById('b04-s44-note');
    const _n = currentSigners();
    if(eObs) eObs.innerHTML='🔍 Di ECDSA: Tx #1 jelas 1 orang, Tx #2 jelas multisig '+_n+' orang, Tx #3 jelas multisig 2 orang. <strong>Siapapun bisa menganalisis pola kepemilikan.</strong>';
    if(sObs) sObs.innerHTML='🔒 Di Schnorr: ketiga transaksi terlihat identik, masing-masing hanya punya 1 tanda tangan. <strong>Tidak ada yang bisa tahu mana yang 1 orang, mana yang '+_n+' orang.</strong>';
    if(note) note.textContent='Di blockchain Bitcoin hari ini dengan Taproot, transaksi multisig yang menggunakan MuSig terlihat persis sama dengan transaksi biasa. Observer tidak bisa membedakan keduanya — semua terlihat seperti transaksi 1 tanda tangan biasa.';
  }

  const _sl = document.getElementById('b04-s44-signers');
  if(_sl) _sl.addEventListener('input', renderAgg);
  renderAgg();
})();

// PAGE 7 · BAB 4 · 4.5 SIMULATION (Merkle Tree)
// ============================================================
(function() {
  const canvas = document.getElementById('b04-s45-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isDark = matchMedia('(prefers-color-scheme:dark)').matches;

  const BG    = isDark ? '#1A1A18' : '#F4F4F0';
  const COL   = isDark ? '#2A2A28' : '#FAFAF8';
  const BORD  = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.15)';
  const TXT2  = isDark ? '#A0A098' : '#3A3A35';
  const HI    = '#534AB7';
  const HIL   = isDark ? 'rgba(83,74,183,0.3)' : '#EEEDFE';
  const SIB   = isDark ? '#3A3830' : '#F4F4F0';
  const GREEN = '#3B6D11';
  const GREENL= isDark ? 'rgba(59,109,17,0.25)' : '#EAF3DE';

  function xorshift(s){s=(s||1)>>>0;s^=s<<13;s=s>>>0;s^=s>>17;s^=s<<5;s=s>>>0;return s;}
  function makeHex(seed,len){let s=seed>>>0||0xdeadbeef,h='';for(let i=0;i<len;i++){s=xorshift(s^(i*0x9e3779b9));h+=(s&0xff).toString(16).padStart(2,'0');}return h;}
  function short(h){return h.slice(0,6)+'...';}
  function combineHash(a,b){const seed=parseInt(a.slice(0,8),16)^parseInt(b.slice(0,8),16);return makeHex(seed*0x9e3779b9,16);}

  const TX_COUNT = 8;
  const txHashes = Array.from({length:TX_COUNT},(_,i)=>makeHex((i+1)*0xdeadbeef,16));

  const levels = [txHashes];
  let cur = txHashes;
  while(cur.length > 1){
    const next=[];
    for(let i=0;i<cur.length;i+=2) next.push(combineHash(cur[i],cur[i+1]));
    levels.push(next); cur=next;
  }

  let selectedTx = null;

  function setup(){
    const dpr  = window.devicePixelRatio||1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width*dpr;
    canvas.height = 340*dpr;
    ctx.scale(dpr,dpr);
    return {W:rect.width, H:340};
  }

  function getPositions(W){
    const pos=[];
    const LEVEL_Y=[280,200,130,60];
    const NODE_W=70, NODE_H=28;
    levels.forEach((level,li)=>{
      const n=level.length;
      const total=n*NODE_W+(n-1)*16;
      const startX=(W-total)/2;
      pos.push(level.map((hash,i)=>({
        x:startX+i*(NODE_W+16), y:LEVEL_Y[li]-NODE_H/2,
        w:NODE_W, h:NODE_H, hash, li, i
      })));
    });
    return pos;
  }

  function getMerkleProof(txIdx){
    const proof=[];
    let idx=txIdx;
    for(let li=0;li<levels.length-1;li++){
      const sibIdx=idx%2===0?idx+1:idx-1;
      if(sibIdx<levels[li].length) proof.push({hash:levels[li][sibIdx],level:li,sibIdx});
      idx=Math.floor(idx/2);
    }
    return proof;
  }

  function getProofNodeIds(txIdx){
    const ids=new Set();
    ids.add(`0-${txIdx}`);
    let idx=txIdx;
    for(let li=0;li<levels.length-1;li++){
      const sibIdx=idx%2===0?idx+1:idx-1;
      if(sibIdx<levels[li].length) ids.add(`${li}-${sibIdx}`);
      idx=Math.floor(idx/2);
      ids.add(`${li+1}-${idx}`);
    }
    return ids;
  }

  function draw(sel){
    const {W,H}=setup();
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG;
    ctx.beginPath(); ctx.roundRect(0,0,W,H,12); ctx.fill();

    const pos=getPositions(W);
    const proofIds=sel!==null?getProofNodeIds(sel):new Set();

    // Lines
    for(let li=0;li<levels.length-1;li++){
      for(let i=0;i<levels[li].length;i++){
        const node=pos[li][i];
        const parent=pos[li+1][Math.floor(i/2)];
        const onPath=proofIds.has(`${li}-${i}`)&&proofIds.has(`${li+1}-${Math.floor(i/2)}`);
        ctx.beginPath();
        ctx.moveTo(node.x+node.w/2, node.y);
        ctx.lineTo(parent.x+parent.w/2, parent.y+parent.h);
        ctx.strokeStyle=onPath?HI:(isDark?'rgba(255,255,255,0.1)':'rgba(124,58,237,0.1)');
        ctx.lineWidth=onPath?1.5:0.5;
        ctx.stroke();
      }
    }

    // Nodes
    for(let li=0;li<levels.length;li++){
      for(let i=0;i<levels[li].length;i++){
        const n=pos[li][i];
        const key=`${li}-${i}`;
        const isLeaf   =li===0;
        const isTarget =sel!==null&&li===0&&i===sel;
        const isSibling=sel!==null&&proofIds.has(key)&&!isTarget&&li<levels.length-1;
        const isParent =sel!==null&&proofIds.has(key)&&li>0&&li<levels.length-1;
        const isRoot   =li===levels.length-1;
        const onPath   =proofIds.has(key);

        let fillColor=COL, strokeColor=BORD, strokeW=0.5;
        if(isTarget)       {fillColor=HI;    strokeColor=HI;    strokeW=1.5;}
        else if(isSibling) {fillColor=SIB;   strokeColor=isDark?'rgba(255,255,255,0.15)':BORD;}
        else if(isParent)  {fillColor=HIL;   strokeColor=HI;    strokeW=1;}
        else if(isRoot)    {fillColor=GREENL;strokeColor=GREEN; strokeW=1;}
        else if(isLeaf)    {fillColor=isDark?'#2D2A45':'#EEEDFE'; strokeColor='#7C5CFC'; strokeW=1.5;}

        ctx.fillStyle=fillColor; ctx.strokeStyle=strokeColor; ctx.lineWidth=strokeW;
        ctx.beginPath(); ctx.roundRect(n.x,n.y,n.w,n.h,6); ctx.fill(); ctx.stroke();

        const label=li===0?`Tx${i+1}`:li===levels.length-1?'Root':`H${li}${i}`;
        ctx.fillStyle=isTarget?'#fff':isRoot?GREEN:(isLeaf&&!isTarget?'#7C5CFC':(onPath?HI:TXT2));
        ctx.font=`600 10px sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label, n.x+n.w/2, n.y+10);
        ctx.fillStyle=isTarget?'rgba(255,255,255,0.85)':(isLeaf?'rgba(124,92,252,0.7)':(isDark?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.35)'));
        ctx.font=`9px monospace`;
        ctx.fillText(short(n.hash), n.x+n.w/2, n.y+21);
      }
    }

    if(sel===null){
      ctx.fillStyle=isDark?'rgba(124,92,252,0.6)':'rgba(83,74,183,0.5)';
      ctx.font=`11px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillText('↑ Klik salah satu Tx (baris bawah) untuk lihat Merkle Proof-nya', W/2, H-10);

      // Legend kecil di kanan bawah
      const lx=W-12, ly=H-30;
      ctx.fillStyle=isDark?'#2D2A45':'#EEEDFE';
      ctx.strokeStyle='#7C5CFC'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(lx-60,ly,58,20,4); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#7C5CFC'; ctx.font=`500 9px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('Tx = bisa diklik', lx-31, ly+10);
    }
  }

  function showProof(txIdx){
    const proof=getMerkleProof(txIdx);
    const proofEl=document.getElementById('b04-s45-proof');
    const bodyEl =document.getElementById('b04-s45-proof-body');
    const titleEl=document.getElementById('b04-s45-proof-title');
    if(!proofEl||!bodyEl||!titleEl) return;
    titleEl.textContent=`Tx${txIdx+1} · ${short(txHashes[txIdx])}`;
    let html=`
      <div class="mt-proof-row">
        <span class="mt-proof-tag target">Target</span>
        <span class="mt-proof-val">${txHashes[txIdx]}</span>
      </div>`;
    proof.forEach(p=>{
      html+=`
        <div class="mt-proof-row">
          <span class="mt-proof-tag sibling">Sibling L${p.level}</span>
          <span class="mt-proof-val">${p.hash}</span>
        </div>`;
    });
    html+=`
      <div class="mt-proof-row">
        <span class="mt-proof-tag root">Merkle Root</span>
        <span class="mt-proof-val">${levels[levels.length-1][0]}</span>
      </div>
      <div class="mt-proof-note">
        Dengan ${proof.length} hash ini, siapapun bisa menghitung ulang jalur dari Tx${txIdx+1} sampai Root dan memverifikasi bahwa transaksi ini ada di block — tanpa perlu melihat ${TX_COUNT-proof.length-1} transaksi lainnya.
      </div>`;
    bodyEl.innerHTML=html;
    proofEl.classList.add('show');
  }

  canvas.addEventListener('mousemove', function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    const pos=getPositions(rect.width);
    const leaves=pos[0];
    let onLeaf=false;
    for(let i=0;i<leaves.length;i++){
      const n=leaves[i];
      if(mx>=n.x&&mx<=n.x+n.w&&my>=n.y&&my<=n.y+n.h){onLeaf=true;break;}
    }
    canvas.style.cursor=onLeaf?'pointer':'default';
  });

  canvas.addEventListener('mouseleave', function(){
    canvas.style.cursor='default';
  });

  canvas.addEventListener('click', function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;
    const pos=getPositions(rect.width);
    const leaves=pos[0];
    for(let i=0;i<leaves.length;i++){
      const n=leaves[i];
      if(mx>=n.x&&mx<=n.x+n.w&&my>=n.y&&my<=n.y+n.h){
        if(selectedTx===i){
          selectedTx=null;
          const proofEl=document.getElementById('b04-s45-proof');
          if(proofEl) proofEl.classList.remove('show');
          draw(null);
        } else {
          selectedTx=i;
          showProof(i);
          draw(i);
        }
        return;
      }
    }
  });

  draw(null);
  window.addEventListener('resize', ()=>draw(selectedTx));

  // Fix: render saat section pertama kali dibuka
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => { requestAnimationFrame(() => draw(selectedTx)); });
    ro.observe(canvas);
  }
  canvas.addEventListener('mt-redraw', () => draw(selectedTx));
  requestAnimationFrame(() => draw(selectedTx));

  // Raw data toggle
  const rawBtn45   = document.getElementById('b04-s45-raw-btn');
  const rawPanel45 = document.getElementById('b04-s45-raw-panel');
  const rawBody45  = document.getElementById('b04-s45-raw-body');
  let rawOpen45 = false;

  function buildRaw45(txIdx) {
    const merkleRoot = levels[levels.length-1][0];
    const proof      = getMerkleProof(txIdx);
    const txid       = txHashes[txIdx];
    // Simulasi block header fields
    const blockHash  = makeHex(0xcafe1234 * (txIdx+1), 32);
    const prevHash   = makeHex(0xdeadbeef, 32);
    const txidLE     = txid.match(/.{2}/g).reverse().join(''); // little-endian
    const rootLE     = merkleRoot.match(/.{2}/g).reverse().join('');

    const proofLines = proof.map((p,i) =>
      `  "${p.hash}" <span class="raw-comment">// sibling level ${p.level}</span>`
    ).join(',\n');

    return `<span class="raw-comment">// bitcoin-cli getblockheader "${blockHash.slice(0,16)}..."</span>
{
  <span class="raw-key">"hash"</span>: <span class="raw-str">"${blockHash}"</span>,
  <span class="raw-key">"version"</span>: <span class="raw-num">536870912</span>,
  <span class="raw-key">"previousblockhash"</span>: <span class="raw-str">"${prevHash}"</span>,
  <span class="raw-key">"merkleroot"</span>: <span class="raw-str">"${rootLE}"</span>, <span class="raw-comment">// little-endian, seperti di block header</span>
  <span class="raw-key">"time"</span>: <span class="raw-num">1713000000</span>,
  <span class="raw-key">"bits"</span>: <span class="raw-str">"1703a30c"</span>,
  <span class="raw-key">"nonce"</span>: <span class="raw-num">3850463748</span>,
  <span class="raw-key">"ntx"</span>: <span class="raw-num">${TX_COUNT}</span>
}

<span class="raw-comment">// Tx yang dipilih: Tx${txIdx+1}</span>
<span class="raw-key">"txid"</span>: <span class="raw-str">"${txidLE}"</span> <span class="raw-comment">// little-endian TXID</span>

<span class="raw-comment">// Merkle Proof untuk verifikasi Tx${txIdx+1}:</span>
<span class="raw-comment">// Dengan ${proof.length} hash ini + TXID, siapapun bisa menghitung ulang</span>
<span class="raw-comment">// Merkle Root dan membuktikan Tx${txIdx+1} ada di block ini.</span>
[
${proofLines}
]

<span class="raw-comment">// Merkle Root yang dihitung: "${merkleRoot}"</span>
<span class="raw-comment">// Cocok dengan merkleroot di block header? ${merkleRoot.match(/.{2}/g).reverse().join('') === rootLE ? '✓ Ya' : '✓ Ya'}</span>`;
  }

  function updateRaw45() {
    if (!rawOpen45 || !rawBody45) return;
    if (selectedTx === null) {
      rawBody45.innerHTML = 'Klik salah satu Tx untuk melihat Merkle Root dan Merkle Proof dalam format raw.';
    } else {
      rawBody45.innerHTML = buildRaw45(selectedTx);
    }
  }

  if (rawBtn45) rawBtn45.addEventListener('click', () => {
    rawOpen45 = !rawOpen45;
    rawBtn45.classList.toggle('active', rawOpen45);
    rawBtn45.innerHTML = rawOpen45
      ? '<span class="raw-toggle-icon">{}</span> Sembunyikan Raw Data'
      : '<span class="raw-toggle-icon">{}</span> Lihat Raw Data';
    if (rawOpen45 && rawPanel45) { rawPanel45.classList.add('show'); updateRaw45(); }
    else if (rawPanel45) rawPanel45.classList.remove('show');
  });

  // Update raw setiap kali Tx dipilih — hook ke canvas click
  const origCanvasClick = canvas.onclick;
  canvas.addEventListener('click', () => {
    setTimeout(() => updateRaw45(), 50);
  });
})();

// PAGE 7 · BAB 4 · 4.6 SIMULATION (System Map)
// ============================================================
(function() {
  const COMPONENTS = [
    {
      id:'hash', name:'Fungsi Hash (SHA-256)', color:'purple', tag:'Integritas',
      role:'Menjaga rantai block tidak bisa dimanipulasi',
      menjaga:'Integritas blockchain',
      cara:'Setiap block berisi hash dari block sebelumnya. Mengubah satu transaksi lama berarti menghitung ulang hash seluruh rantai sesudahnya — secara komputasi mustahil.',
      tanpa:'Tanpa hash, riwayat transaksi bisa dimanipulasi oleh siapapun.',
      dipakai:['Header block','Mining (PoW)','TXID','Alamat Bitcoin'],
    },
    {
      id:'ecc', name:'Elliptic Curve (ECC)', color:'teal', tag:'Kepemilikan',
      role:'Menghasilkan keypair yang tidak bisa dipalsukan',
      menjaga:'Kepemilikan Bitcoin',
      cara:'Private key menghasilkan public key melalui perkalian titik di atas kurva. Satu arah, tidak bisa dibalik. Tanpa private key, tidak ada yang bisa mengklaim kepemilikan UTXO-mu.',
      tanpa:'Tanpa ECC, siapapun bisa memalsukan klaim kepemilikan Bitcoin orang lain.',
      dipakai:['Generate keypair','Dasar ECDSA','Dasar Schnorr','Alamat Bitcoin'],
    },
    {
      id:'ecdsa', name:'ECDSA & Schnorr', color:'amber', tag:'Otorisasi',
      role:'Membuktikan kepemilikan tanpa mengungkapkan rahasia',
      menjaga:'Validitas setiap transaksi',
      cara:'Private key menandatangani transaksi. Jaringan memverifikasi tanda tangan menggunakan public key tanpa pernah melihat private key. Schnorr menggabungkan banyak tanda tangan menjadi satu.',
      tanpa:'Tanpa tanda tangan digital, siapapun bisa memindahkan Bitcoin orang lain.',
      dipakai:['Setiap input transaksi','Multisig (MuSig)','Taproot','Script Bitcoin'],
    },
    {
      id:'merkle', name:'Merkle Tree', color:'green', tag:'Efisiensi',
      role:'Memungkinkan verifikasi tanpa mengunduh seluruh data',
      menjaga:'Efisiensi dan skalabilitas verifikasi',
      cara:'Seluruh transaksi dalam sebuah block dirangkum dalam satu Merkle Root. Untuk membuktikan satu transaksi, hanya butuh log₂(n) hash, bukan seluruh isi block.',
      tanpa:'Tanpa Merkle Tree, smartphone tidak bisa memverifikasi transaksi tanpa mengunduh ratusan GB data.',
      dipakai:['Header block','SPV wallet','Light client','Block explorer'],
    },
  ];

  let activeId = null;

  function g(id){ return document.getElementById(id); }

  function render(){
    const grid = g('b04-s46-grid');
    if(!grid) return;
    grid.innerHTML = COMPONENTS.map(c => `
      <div class="csm-card${activeId===c.id?' active':''} ${c.color}" id="b04-s46-${c.id}">
        <div class="csm-card-top">
          <div class="csm-dot ${c.color}"></div>
          <div class="csm-name">${c.name}</div>
          <span class="csm-tag ${c.color}">${c.tag}</span>
        </div>
        <div class="csm-role">${c.role}</div>
      </div>`).join('');

    COMPONENTS.forEach(c => {
      const el = g('b04-s46-'+c.id);
      if(el) el.addEventListener('click', () => {
        if(activeId===c.id){ activeId=null; hide(); }
        else { activeId=c.id; show(c); }
        render();
      });
    });
  }

  function show(c){
    const head = g('b04-s46-detail-head');
    const body = g('b04-s46-detail-body');
    const det  = g('b04-s46-detail');
    const sum  = g('b04-s46-summary');
    if(!head||!body||!det||!sum) return;
    head.className = `csm-detail-head ${c.color}`;
    head.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block"></span>${c.name} — ${c.tag}`;
    body.innerHTML = `
      <div class="csm-detail-row">
        <span class="csm-detail-label">Menjaga</span>
        <span class="csm-detail-val">${c.menjaga}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Cara kerja</span>
        <span class="csm-detail-val">${c.cara}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Jika tidak ada</span>
        <span class="csm-detail-val">${c.tanpa}</span>
      </div>
      <div class="csm-detail-row">
        <span class="csm-detail-label">Dipakai di</span>
        <div class="csm-chain">${c.dipakai.map(d=>`<span class="csm-chain-item">${d}</span>`).join('')}</div>
      </div>`;
    det.classList.add('show');
    sum.textContent = 'Keempat komponen ini bekerja bersama. Tidak ada satu pun yang bisa dihilangkan tanpa meruntuhkan seluruh sistem kepercayaan Bitcoin.';
  }

  function hide(){
    const det = g('b04-s46-detail');
    const sum = g('b04-s46-summary');
    if(det) det.classList.remove('show');
    if(sum) sum.textContent = 'Klik salah satu komponen di atas untuk melihat perannya dalam sistem Bitcoin.';
  }

  render();
})();

