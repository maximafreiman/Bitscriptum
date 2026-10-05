/* ============================================================
   LAB C1 · SHA-256 DIBEDAH
   Implementasi sendiri supaya keadaan tiap ronde bisa diambil.
   Diverifikasi terhadap vektor uji resmi di akhir berkas.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n;i++) if(n%i===0){ok=0;break;}
    if(ok) pr.push(n); n++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));

  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function pad(bytes){
    var l=bytes.length, bl=l*8, out=bytes.slice();
    out.push(0x80);
    while(out.length%64!==56) out.push(0);
    for(var i=7;i>=0;i--) out.push(Math.floor(bl/Math.pow(2,i*8))&255);
    return out;
  }
  function schedule(block){
    var w=[];
    for(var t=0;t<16;t++) w.push(((block[t*4]<<24)|(block[t*4+1]<<16)|(block[t*4+2]<<8)|block[t*4+3])>>>0);
    for(var t=16;t<64;t++){
      var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
      var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
      w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
    }
    return w;
  }
  /* Menjalankan satu blok dan menyimpan keadaan tiap ronde. */
  function runBlock(block,H){
    var w=schedule(block), v=H.slice(), trace=[v.slice()];
    for(var t=0;t<64;t++){
      var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
      var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
      var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
      var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
      var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
      var T2=(S0+mj)>>>0;
      v=[(T1+T2)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      trace.push(v.slice());
    }
    var out=[]; for(var i=0;i<8;i++) out.push((H[i]+v[i])>>>0);
    return {w:w,trace:trace,H:out};
  }
  function hashAll(bytes){
    var p=pad(bytes), H=H0.slice(), blocks=[], runs=[];
    for(var i=0;i<p.length;i+=64) blocks.push(p.slice(i,i+64));
    for(var b=0;b<blocks.length;b++){ var r=runBlock(blocks[b],H); runs.push(r); H=r.H; }
    return {padded:p,blocks:blocks,runs:runs,H:H};
  }
  function hex(x){ return ('00000000'+x.toString(16)).slice(-8); }
  function digest(H){ return H.map(hex).join(''); }
  function bytesOf(s){ return Array.from(new TextEncoder().encode(s)); }

  /* ---- verifikasi diri terhadap vektor uji resmi ---- */
  var SELFTEST = digest(hashAll(bytesOf('abc')).H)===
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' &&
    digest(hashAll(bytesOf('')).H)===
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  function g(id){ return document.getElementById(id); }
  var state={msg:'satoshi',round:0,word:20,timer:null};

  function render(){
    var msg=state.msg, by=bytesOf(msg), R=hashAll(by);
    var p=R.padded, run=R.runs[0];

    /* --- 1. padding --- */
    var bx=g('lab-c1-bytes'); if(bx){
      var h='',lim=Math.min(p.length,64);
      for(var i=0;i<lim;i++){
        var c = i<by.length?'m' : (i===by.length?'k' : (i>=lim-8?'l':'z'));
        h+='<i class="'+c+'">'+('0'+p[i].toString(16)).slice(-2)+'</i>';
      }
      bx.innerHTML=h;
      g('lab-c1-padinfo').textContent = by.length+' '+LBL.bytes+' \u2192 '+p.length+' '+LBL.bytes+' ('+(p.length*8)+' '+LBL.bits+')';
    }

    /* --- 2. message schedule --- */
    var ws=g('lab-c1-words'); if(ws){
      var h='';
      for(var t=0;t<64;t++){
        var cls = t<16?'base':'';
        if(t===state.word) cls='sel';
        else if(state.word>=16 && (t===state.word-16||t===state.word-15||t===state.word-7||t===state.word-2)) cls='src';
        h+='<i data-w="'+t+'" class="'+cls+'">'+t+'</i>';
      }
      ws.innerHTML=h;
      var wv=g('lab-c1-wordval');
      if(state.word<16) wv.innerHTML=LBL.p2sel+state.word+' = '+hex(run.w[state.word])+' \u00b7 '+(LANG==='id'?'langsung dari pesan':'straight from the message');
      else wv.innerHTML=LBL.p2sel+state.word+' = '+hex(run.w[state.word])+' \u00b7 '+LBL.p2from+' W'+(state.word-16)+', W'+(state.word-15)+', W'+(state.word-7)+', W'+(state.word-2);
    }

    /* --- 3. 64 ronde --- */
    var rg=g('lab-c1-regs'); if(rg){
      var cur=run.trace[state.round], nm=['a','b','c','d','e','f','g','h'], h='';
      for(var i=0;i<8;i++){
        var isNew = (i===0||i===4);
        h+='<div class="sh-reg '+(isNew?'new':'shift')+'">'+
           '<span class="sh-reg-n">'+nm[i]+'</span>'+
           '<span class="sh-reg-v">'+hex(cur[i])+'</span>'+
           '<span class="sh-reg-t">'+(isNew?LBL.p3new:LBL.p3shift)+'</span></div>';
      }
      rg.innerHTML=h;
      g('lab-c1-rnum').textContent=LBL.p3step+' '+state.round+'/64';
      var sl=g('lab-c1-slider'); if(sl && +sl.value!==state.round) sl.value=state.round;
    }

    /* --- 4. avalanche --- */
    var av=g('lab-c1-av'); if(av){
      var b2=by.slice(); if(b2.length===0) b2=[0]; b2[0]=b2[0]^1;
      var R2=hashAll(b2), t1=R.runs[0].trace, t2=R2.runs[0].trace;
      var d=0, A=t1[state.round], B=t2[state.round];
      for(var i=0;i<8;i++){ var x=(A[i]^B[i])>>>0; while(x){ d+=x&1; x>>>=1; } }
      var pc=(d/256*100);
      av.innerHTML='<i style="width:'+pc.toFixed(1)+'%"></i>';
      g('lab-c1-avnum').innerHTML=LBL.p3step+' '+state.round+
        ' <b style="color:#1A1A18">'+d+' / 256</b> <span style="color:#534AB7">'+pc.toFixed(1)+'%</span>';
    }

    /* --- hasil --- */
    var hh=g('lab-c1-hash');
    if(hh) hh.textContent=digest(R.H);
  }

  function step(d){
    state.round=Math.max(0,Math.min(64,state.round+d)); render();
  }
  function play(){
    var btn=g('lab-c1-play');
    if(state.timer){ clearInterval(state.timer); state.timer=null; btn.textContent=LBL.play; return; }
    if(state.round>=64) state.round=0;
    btn.textContent=LBL.pause;
    state.timer=setInterval(function(){
      if(state.round>=64){ clearInterval(state.timer); state.timer=null; btn.textContent=LBL.play; return; }
      step(1);
    },110);
  }

  function init(){
    if(!g('lab-c1-regs')) return;
    if(!SELFTEST){ g('lab-c1-hash').textContent='self-test gagal'; return; }
    g('lab-c1-msg').addEventListener('input',function(e){
      state.msg=e.target.value||' '; state.round=0; render();
    });
    g('lab-c1-slider').addEventListener('input',function(e){ state.round=+e.target.value; render(); });
    g('lab-c1-next').addEventListener('click',function(){ step(1); });
    g('lab-c1-play').addEventListener('click',play);
    g('lab-c1-reset').addEventListener('click',function(){
      if(state.timer){clearInterval(state.timer);state.timer=null;g('lab-c1-play').textContent=LBL.play;}
      state.round=0; render();
    });
    g('lab-c1-words').addEventListener('click',function(e){
      var w=e.target.getAttribute('data-w'); if(w!==null){ state.word=+w; render(); }
    });
    g('lab-c1-ok').textContent=LBL.verify;
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LANG2="en";
var LBL2={"m1lab": "Number", "m1res": "mod 17 =", "m1round": "full turns", "m2left": "y² mod 17", "m2right": "(x³ + 7) mod 17", "m2yes": "They match, this point is on the curve", "m2no": "They differ, this point is off the curve", "m3step": "Step", "m3auto": "Run on its own", "m3now": "Now at", "m3op": "Operation", "m3dbl": "Doubling (P + P)", "m3add": "Addition (P + G)", "m3lam": "Slope λ", "m3x3": "x₃ = λ² - x₁ - x₂", "m3y3": "y₃ = λ(x₁ - x₃) - y₁", "m3wrap": "After 17 steps you are back where you started. The points really are finite.", "m4cmp": "Plain ladder needs", "m4vs": "Shortcut needs", "m4steps": "steps", "m4res": "Result", "m5G": "G (generator point)", "m5k": "k (private key)", "m5P": "P = k × G (public key)", "m5fixed": "fixed by the standard, identical for everyone", "m5unc": "Uncompressed", "m5cmp": "Compressed", "m5here": "on this curve", "m5real": "on secp256k1", "m5even": "Because y = {y} is even, the prefix is <b>02</b>. The y value is not stored at all; only its parity is noted, then y is recomputed from x when needed. That halves the size, as discussed in 2.3.", "m5odd": "Because y = {y} is odd, the prefix is <b>03</b>. The y value is not stored at all; only its parity is noted, then y is recomputed from x when needed. That halves the size, as discussed in 2.3.", "m5toy": "This toy curve", "m5secp": "secp256k1", "m5tries": "attempts"};

/* ============================================================
   LAB C2 · secp256k1 DIBEDAH DARI NOL
   Kurva mainan y^2 = x^3 + 7 mod 17, generator G = (6,6), 17 titik.
   Rumus di sini identik dengan yang dipakai secp256k1.
============================================================ */
(function(){
  var P=17, B=7, G=[6,6];
  function md(a){ return ((a%P)+P)%P; }
  function invP(a){ var r=1,b=md(a),e=P-2; while(e>0){ if(e&1) r=r*b%P; b=b*b%P; e>>=1; } return r; }
  function eq(u,v){ return !!u&&!!v&&u[0]===v[0]&&u[1]===v[1]; }
  function onCurve(x,y){ return md(y*y)===md(x*x*x+B); }
  /* Mengembalikan hasil beserta lambda, supaya rumusnya bisa ditampilkan. */
  function addPt(p1,p2){
    if(!p1) return {R:p2?p2.slice():null,lam:null,op:'id'};
    if(!p2) return {R:p1.slice(),lam:null,op:'id'};
    if(p1[0]===p2[0] && md(p1[1]+p2[1])===0) return {R:null,lam:null,op:'inf'};
    var lam,op;
    if(eq(p1,p2)){ lam=md(3*p1[0]*p1[0]*invP(2*p1[1])); op='dbl'; }
    else { lam=md((p2[1]-p1[1])*invP(p2[0]-p1[0])); op='add'; }
    var x3=md(lam*lam-p1[0]-p2[0]), y3=md(lam*(p1[0]-x3)-p1[1]);
    return {R:[x3,y3],lam:lam,op:op};
  }
  var PTS=[]; for(var x=0;x<P;x++) for(var y=0;y<P;y++) if(onCurve(x,y)) PTS.push([x,y]);
  var MULT=[]; (function(){ var R=null; for(var i=1;i<=P+1;i++){ R=addPt(R,G).R; if(!R) break; MULT.push(R.slice()); } })();
  function mulG(k){ return MULT[(k-1+MULT.length)%MULT.length]; }
  function h2(v){ return ('0'+v.toString(16)).slice(-2); }
  function fp(p){ return p?('('+p[0]+', '+p[1]+')'):'\u221e'; }
  function g(id){ return document.getElementById(id); }
  var st={num:36,tx:6,ty:6,rung:1,k:5,timer:null};

  function renderMod(){
    var el=g('lab-c2-clock'); if(!el) return;
    var n=st.num, r=md(n), turns=Math.floor(n/P), h='';
    for(var i=0;i<P;i++) h+='<i class="'+(i===r?'hit':((turns>0||i<r)?'pass':''))+'">'+i+'</i>';
    el.innerHTML=h;
    g('lab-c2-modout').innerHTML='<dt>'+LBL2.m1lab+'</dt><dd>'+n+'</dd>'+
      '<dt>'+LBL2.m1round+'</dt><dd>'+turns+'</dd>'+
      '<dt>'+LBL2.m1res+'</dt><dd class="hl">'+r+'</dd>';
  }

  function renderCheck(){
    var el=g('lab-c2-check'); if(!el) return;
    var x=st.tx,y=st.ty, left=md(y*y), right=md(x*x*x+B), ok=(left===right);
    el.innerHTML=
      '<div><span class="t">y\u00b2</span><span class="v">'+y+'\u00b2 = '+(y*y)+'</span></div>'+
      '<div class="hot"><span class="t">'+LBL2.m2left+'</span><span class="v">'+(y*y)+' mod 17 = '+left+'</span></div>'+
      '<div><span class="t">x\u00b3 + 7</span><span class="v">'+x+'\u00b3 + 7 = '+(x*x*x+B)+'</span></div>'+
      '<div class="hot"><span class="t">'+LBL2.m2right+'</span><span class="v">'+(x*x*x+B)+' mod 17 = '+right+'</span></div>';
    var v=g('lab-c2-cverdict');
    v.className='ec-verdict '+(ok?'ok':'no');
    v.textContent=(ok?LBL2.m2yes:LBL2.m2no)+'  \u00b7  '+left+(ok?' = ':' \u2260 ')+right;
    drawGrid();
  }

  function renderLadder(){
    var el=g('lab-c2-eq'); if(!el) return;
    var n=st.rung, prev=(n===1?null:mulG(n-1)), res=mulG(n);
    var det=(n===1?{lam:null,op:'start'}:addPt(prev,G)), h='';
    h+='<div><span class="t">'+LBL2.m3now+'</span><span class="v">'+n+'\u00d7G = '+fp(res)+'</span></div>';
    if(n===1){
      h+='<div class="hot"><span class="t">'+LBL2.m3op+'</span><span class="v">G '+
         (LANG2==='id'?'itu sendiri, titik awal tangga':'itself, the first rung')+'</span></div>';
    } else {
      h+='<div><span class="t">'+LBL2.m3op+'</span><span class="v">'+
         (det.op==='dbl'?LBL2.m3dbl:LBL2.m3add)+'  \u00b7  '+fp(prev)+' + '+fp(G)+'</span></div>';
      h+='<div class="hot"><span class="t">'+LBL2.m3lam+'</span><span class="v">\u03bb = '+
         (det.op==='dbl'?('3\u00b7'+prev[0]+'\u00b2 / (2\u00b7'+prev[1]+')')
                        :('('+G[1]+' - '+prev[1]+') / ('+G[0]+' - '+prev[0]+')'))+
         ' mod 17 = '+det.lam+'</span></div>';
      h+='<div><span class="t">'+LBL2.m3x3+'</span><span class="v">= '+det.lam+'\u00b2 - '+prev[0]+' - '+G[0]+
         ' mod 17 = '+res[0]+'</span></div>';
      h+='<div><span class="t">'+LBL2.m3y3+'</span><span class="v">= '+det.lam+'('+prev[0]+' - '+res[0]+
         ') - '+prev[1]+' mod 17 = '+res[1]+'</span></div>';
    }
    el.innerHTML=h;
    g('lab-c2-rung').textContent=LBL2.m3step+' '+n+' / 17';
    g('lab-c2-wrap').textContent=(n===17?LBL2.m3wrap:'');
    drawGrid();
  }
  function stepLadder(){ st.rung=(st.rung>=17?1:st.rung+1); renderLadder(); }

  function renderFast(){
    var el=g('lab-c2-trace'); if(!el) return;
    var k=st.k, bits=k.toString(2), R=null, tr=[];
    for(var i=0;i<bits.length;i++){
      if(R){ R=addPt(R,R).R; tr.push(['DOUBLE',R]); }
      if(bits[i]==='1'){ R=(R?addPt(R,G).R:G.slice()); tr.push(['ADD G',R]); }
    }
    var bh=''; for(var i=0;i<bits.length;i++) bh+='<i class="'+(bits[i]==='1'?'one':'')+'">'+bits[i]+'</i>';
    g('lab-c2-bits').innerHTML=bh;
    var th=''; for(var i=0;i<tr.length;i++)
      th+='<div class="'+(tr[i][0]==='ADD G'?'add':'')+'"><span class="op">'+tr[i][0]+
          '</span><span>'+fp(tr[i][1])+'</span></div>';
    el.innerHTML=th;
    g('lab-c2-fastout').innerHTML='<dt>'+LBL2.m4cmp+'</dt><dd>'+k+' '+LBL2.m4steps+'</dd>'+
      '<dt>'+LBL2.m4vs+'</dt><dd class="hl">'+tr.length+' '+LBL2.m4steps+'</dd>'+
      '<dt>'+LBL2.m4res+'</dt><dd class="ok">'+fp(R)+'</dd>';
    g('lab-c2-kval').textContent='k = '+k;
    renderKey();
  }

  function renderKey(){
    var el=g('lab-c2-key'); if(!el) return;
    var k=st.k, Pk=mulG(k);
    el.innerHTML='<dt>'+LBL2.m5G+'</dt><dd>('+G[0]+', '+G[1]+') \u00b7 <em style="font-style:normal;color:#854F0B">'+LBL2.m5fixed+'</em></dd>'+
      '<dt>'+LBL2.m5k+'</dt><dd class="hl">'+k+'</dd>'+
      '<dt>'+LBL2.m5P+'</dt><dd class="ok">'+fp(Pk)+'</dd>';
    var even=(Pk[1]%2===0), pre=even?'02':'03';
    g('lab-c2-fmt').innerHTML=
      '<div><span class="t">'+LBL2.m5unc+'</span><code><b>04</b> <i>'+h2(Pk[0])+'</i> <u>'+h2(Pk[1])+'</u></code>'+
      '<em>3 byte '+LBL2.m5here+' \u00b7 65 byte '+LBL2.m5real+'</em></div>'+
      '<div><span class="t">'+LBL2.m5cmp+'</span><code><b>'+pre+'</b> <i>'+h2(Pk[0])+'</i></code>'+
      '<em>2 byte '+LBL2.m5here+' \u00b7 33 byte '+LBL2.m5real+'</em></div>';
    g('lab-c2-parity').innerHTML=(even?LBL2.m5even:LBL2.m5odd).replace('{y}',Pk[1]);
    g('lab-c2-brute').innerHTML=
      '<div class="ec-card"><div class="ec-card-t">'+LBL2.m5toy+'</div>'+
      '<div class="ec-card-v">'+k+' '+LBL2.m5tries+'</div></div>'+
      '<div class="ec-card big"><div class="ec-card-t">'+LBL2.m5secp+'</div>'+
      '<div class="ec-card-v">115792089237316195423570985008687907852837564279074904382605163141518161494337</div></div>';
    drawGrid();
  }

  function drawGrid(){
    var el=g('lab-c2-grid'); if(!el) return;
    var cur=mulG(st.rung), prev=(st.rung===1?null:mulG(st.rung-1));
    var h='<div class="ec-mid" style="top:'+(100-9/P*100)+'%"></div>';
    for(var i=0;i<PTS.length;i++){
      var pt=PTS[i], cls='', lab='';
      if(eq(pt,G)){ cls='gen'; lab='G'; }
      if(eq(pt,prev)){ cls=(cls?cls+' ':'')+'prev'; }
      if(eq(pt,cur)){ cls='cur'; lab=st.rung+'G'; }
      h+='<div class="ec-dot '+cls+'" data-x="'+pt[0]+'" data-y="'+pt[1]+'" style="left:'+
         ((pt[0]+0.5)/P*100)+'%;top:'+(100-(pt[1]+0.5)/P*100)+'%" title="('+pt[0]+', '+pt[1]+')">'+lab+'</div>';
    }
    var tOn=onCurve(st.tx,st.ty);
    h+='<div class="ec-dot '+(tOn?'test':'off')+'" style="left:'+((st.tx+0.5)/P*100)+
       '%;top:'+(100-(st.ty+0.5)/P*100)+'%;pointer-events:none">?</div>';
    el.innerHTML=h;
  }

  function init(){
    if(!g('lab-c2-clock')) return;
    g('lab-c2-num').addEventListener('input',function(e){ st.num=+e.target.value; renderMod(); });
    g('lab-c2-tx').addEventListener('input',function(e){ st.tx=+e.target.value; renderCheck(); });
    g('lab-c2-ty').addEventListener('input',function(e){ st.ty=+e.target.value; renderCheck(); });
    g('lab-c2-step').addEventListener('click',stepLadder);
    g('lab-c2-back').addEventListener('click',function(){
      if(st.timer){ clearInterval(st.timer); st.timer=null; g('lab-c2-auto').textContent=LBL2.m3auto; }
      st.rung=1; renderLadder(); });
    g('lab-c2-auto').addEventListener('click',function(){
      var b=g('lab-c2-auto');
      if(st.timer){ clearInterval(st.timer); st.timer=null; b.textContent=LBL2.m3auto; return; }
      b.textContent='\u23f8';
      st.timer=setInterval(function(){ stepLadder();
        if(st.rung===17){ clearInterval(st.timer); st.timer=null; b.textContent=LBL2.m3auto; } },700);
    });
    g('lab-c2-k').addEventListener('input',function(e){ st.k=+e.target.value; renderFast(); });
    renderMod(); renderCheck(); renderLadder(); renderFast();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var L3={"priv": "Private key d", "pub": "Public key", "nonce": "Nonce k", "recov": "Computed private key", "valid": "Signature valid", "invalid": "Signature rejected", "broken": "Private key fully recovered", "safe": "Safe: different k, nothing leaks", "badk": "This k yields s = 0, so it is rejected. Real implementations also retry with a fresh k."};

/* ============================================================
   LAB C3 · TANDA TANGAN DIBEDAH
   Kurva mainan y^2 = x^3 + 7 mod 17, generator (6,6), ordo n = 18.
   Aritmetika sungguhan; nilai diperiksa terhadap hitungan mandiri.
============================================================ */
(function(){
  /* Kurva mainan untuk C3 harus berordo PRIMA, karena ECDSA menuntut k
     punya invers modulo n. Kurva C2 (mod 17) berordo 18 yang komposit,
     sehingga 11 dari 18 nilai k tidak punya invers dan tanda tangannya
     gagal. Di sini dipakai p=43, ordo n=31 yang prima. */
  var P=43, N=31, G=[2,12];
  function m(a,q){ return ((a%q)+q)%q; }
  function invN(a){ var b=m(a,N),e; for(e=1;e<N;e++){ if(m(b*e,N)===1) return e; } return null; }
  function invP(a){ var r=1,b=m(a,P),e=P-2; while(e>0){ if(e&1) r=r*b%P; b=b*b%P; e>>=1; } return r; }
  function addP(p1,p2){
    if(!p1) return p2; if(!p2) return p1;
    if(p1[0]===p2[0] && m(p1[1]+p2[1],P)===0) return null;
    var l = (p1[0]===p2[0]&&p1[1]===p2[1])
      ? m(3*p1[0]*p1[0]*invP(2*p1[1]),P)
      : m((p2[1]-p1[1])*invP(p2[0]-p1[0]),P);
    var x=m(l*l-p1[0]-p2[0],P);
    return [x, m(l*(p1[0]-x)-p1[1],P)];
  }
  function mulP(k){ var R=null,i; k=m(k,N); for(i=0;i<k;i++) R=addP(R,G); return R; }

  /* ECDSA di kurva mainan. z adalah "hash" pesan, dipetakan ke 0..N-1. */
  /* Pengali harus koprima dengan N. Memakai 31 (sama dengan N) membuat
     suku h*31 selalu lenyap, sehingga hanya karakter terakhir berpengaruh. */
  function zOf(s){ var h=0,i; for(i=0;i<s.length;i++) h=(h*33+s.charCodeAt(i))%N; return h; }
  function sign(d,k,z){
    var R=mulP(k); if(!R) return null;
    var r=m(R[0],N); if(r===0) return null;
    var ik=invN(k); if(ik===null) return null;
    var s=m(ik*(z+r*d),N); if(s===0) return null;
    return {r:r,s:s,R:R,k:k,z:z};
  }
  function verify(Q,sig,z){
    var is=invN(sig.s); if(is===null) return {ok:false};
    var u1=m(z*is,N), u2=m(sig.r*is,N);
    var X=addP(mulP(u1), Q?mulP2(Q,u2):null);
    return {ok: X && m(X[0],N)===sig.r, u1:u1, u2:u2, X:X};
  }
  function mulP2(Q,k){ var R=null,i; k=m(k,N); for(i=0;i<k;i++) R=addP(R,Q); return R; }

  function g(id){ return document.getElementById(id); }
  function fmt(p){ return p?('('+p[0]+', '+p[1]+')'):'\u221e'; }
  function row(lab,val,cls){
    return '<div class="sg-step '+(cls||'')+'"><span class="sg-lab">'+lab+'</span>'+
           '<span class="sg-val">'+val+'</span></div>';
  }

  function renderSign(){
    var d=+g('lab-c3-d').value, k=+g('lab-c3-k').value, msg=g('lab-c3-msg').value||'a';
    var z=zOf(msg), Q=mulP(d), sg=sign(d,k,z);
    var h='';
    h+=row(L3.priv,'d = '+d);
    h+=row(L3.pub,'Q = d\u00d7G = '+fmt(Q));
    h+=row(L3.nonce,'k = '+k+'  (rahasia, sekali pakai)');
    if(!sg){ g('lab-c3-sign').innerHTML=h+row('!',L3.badk,'bad');
      var v0=g('lab-c3-verdict'); v0.className='sg-verdict no'; v0.textContent=L3.badk; return; }
    h+=row('R = k\u00d7G', fmt(sg.R));
    h+=row('r','r = x(R) mod n = '+sg.r,'key');
    h+=row('z','z = hash(pesan) = '+z);
    h+=row('s','s = (z + r\u00b7d) / k mod n = '+sg.s,'key');
    g('lab-c3-sign').innerHTML=h;
    var v=verify(Q,sg,z), vh='';
    vh+=row('u1','u1 = z / s = '+v.u1);
    vh+=row('u2','u2 = r / s = '+v.u2);
    vh+=row('X','X = u1\u00d7G + u2\u00d7Q = '+fmt(v.X));
    vh+=row('x(X) vs r', (v.X?m(v.X[0],N):'\u2014')+' vs '+sg.r, v.ok?'good':'bad');
    g('lab-c3-verify').innerHTML=vh;
    var vd=g('lab-c3-verdict');
    vd.className='sg-verdict '+(v.ok?'ok':'no');
    vd.textContent=(v.ok?L3.valid:L3.invalid);
  }

  function renderAttack(){
    var d=+g('lab-c3-ad').value, k=+g('lab-c3-ak').value;
    var reuse=g('lab-c3-reuse').checked;
    var z1=zOf(g('lab-c3-m1').value||'a'), z2=zOf(g('lab-c3-m2').value||'b');
    /* Untuk kasus k berbeda, cari k kedua yang menghasilkan tanda tangan sahih.
       Sebagian k membuat s bernilai nol, dan implementasi sungguhan pun
       menolaknya lalu mengulang dengan k baru. */
    var k2=k;
    if(!reuse){ for(var t=1;t<N;t++){ var cand=m(k+t,N);
      if(cand!==0 && sign(d,cand,z2)){ k2=cand; break; } } }
    var s1=sign(d,k,z1), s2=sign(d,k2,z2);
    if(!s1||!s2){ g('lab-c3-attack').innerHTML=row('!',L3.badk,'bad');
      var vv=g('lab-c3-averdict'); vv.className='sg-verdict no'; vv.textContent=L3.badk; return; }
    var h='';
    h+=row('sig 1','r = '+s1.r+'   s = '+s1.s+'   z = '+z1);
    h+=row('sig 2','r = '+s2.r+'   s = '+s2.s+'   z = '+z2);
    var sama=(s1.r===s2.r);
    h+=row('r sama?', sama?'YA \u2014 penanda k dipakai ulang':'tidak', sama?'bad':'good');
    if(sama){
      var ds=m(s1.s-s2.s,N), ids=invN(ds);
      if(ids===null){ h+=row('!','selisih s tidak bisa dibalik di kurva kecil ini','bad'); }
      else{
        var kRec=m(m(z1-z2,N)*ids,N);
        var ir=invN(s1.r);
        var dRec=(ir===null)?null:m(m(s1.s*kRec-z1,N)*ir,N);
        h+=row('pulihkan k','k = (z1 - z2) / (s1 - s2) = '+kRec,'key');
        h+=row('pulihkan d','d = (s1\u00b7k - z1) / r = '+(dRec===null?'\u2014':dRec),'key');
        h+=row(L3.recov, dRec===null?'\u2014':String(dRec), (dRec===m(d,N))?'bad':'good');
        h+=row('d asli', String(d), (dRec===m(d,N))?'bad':'good');
      }
    }
    g('lab-c3-attack').innerHTML=h;
    var vd=g('lab-c3-averdict');
    vd.className='sg-verdict '+(sama?'no':'ok');
    vd.textContent = sama ? L3.broken : L3.safe;
  }

  function init(){
    if(!g('lab-c3-sign')) return;
    ['lab-c3-d','lab-c3-k','lab-c3-msg'].forEach(function(id){
      g(id).addEventListener('input',renderSign);
    });
    ['lab-c3-ad','lab-c3-ak','lab-c3-m1','lab-c3-m2','lab-c3-reuse'].forEach(function(id){
      g(id).addEventListener('input',renderAttack);
      g(id).addEventListener('change',renderAttack);
    });
    renderSign(); renderAttack();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LANGD="en";
var LD={"p1sats": "Satoshis", "p1frac": "Share of 21 million", "p1share": "Even share per person on earth", "p1pct": "Percent of that share", "p3total": "Total satoshis", "p3spent": "Total spent", "p3avg": "Your average price", "p4h": "Harmonic mean", "p4a": "Arithmetic mean", "p4diff": "Difference", "p4always": "Always lower or equal, never higher", "p4eq": "Exactly equal, because every price is identical"};

/* ============================================================
   LAB D1 · HALVING & DCA
   Hitungan murni. Tidak ada data yang diambil dari luar, tidak ada
   harga historis yang ditanam, dan tidak ada proyeksi.
============================================================ */
(function(){
  function g(id){ return document.getElementById(id); }
  function num(n,d){ return n.toLocaleString(LANGD==='id'?'id-ID':'en-US',
    {minimumFractionDigits:d||0,maximumFractionDigits:d||0}); }
  var TOTAL=21000000, BLOCKS=210000, PERDAY=144;

  /* ---------- 1. satoshi ---------- */
  function renderSats(){
    var btc=parseFloat(g('d1-amt').value)||0;
    var pop=(parseFloat(g('d1-pop').value)||8)*1e9;
    var sats=Math.round(btc*1e8);
    var share=TOTAL/pop*1e8;
    g('d1-sats').innerHTML=
      '<dt>'+LD.p1sats+'</dt><dd class="hl">'+num(sats)+'</dd>'+
      '<dt>'+LD.p1frac+'</dt><dd>'+(btc/TOTAL*100).toFixed(8)+' %</dd>'+
      '<dt>'+LD.p1share+'</dt><dd class="ok">'+num(share)+' sat</dd>'+
      '<dt>'+LD.p1pct+'</dt><dd>'+(share?(sats/share*100).toFixed(2):'0')+' %</dd>';
  }

  /* ---------- 2. halving ---------- */
  function supplyAt(era){ var s=0,n; for(n=0;n<=era;n++) s+=BLOCKS*(50/Math.pow(2,n)); return Math.min(s,TOTAL); }
  function renderHalv(){
    var rows='',e;
    for(e=0;e<=12;e++){
      var rew=50/Math.pow(2,e), day=rew*PERDAY, tot=supplyAt(e);
      var yr=(e===0?2009:2008+e*4);
      rows+='<tr'+(e===4?' class="now"':'')+'><td>'+e+'</td>'+
        '<td class="num">'+ (rew>=0.001? num(rew,3): (rew*1e8).toFixed(0)+' sat') +'</td>'+
        '<td class="num">'+ (day>=0.01? num(day,2): (day*1e8).toFixed(0)+' sat') +'</td>'+
        '<td class="num">~'+yr+'</td>'+
        '<td class="num">'+num(tot)+'</td>'+
        '<td class="num">'+num(TOTAL-tot)+'</td></tr>';
    }
    g('d1-halv').innerHTML=rows;
  }

  /* ---------- 3 & 4. DCA ---------- */
  var PAT={
    rise:[100,115,130,140,155,170,185,200,215,230,245,260],
    fall:[260,240,225,205,190,175,160,145,130,115,105,100],
    vol :[150,90,210,120,260,80,190,140,230,100,170,130],
    flat:[150,150,150,150,150,150,150,150,150,150,150,150]
  };
  var pat='vol';
  function renderDCA(){
    var per=parseFloat(g('d1-buy').value)||0;
    var pr=PAT[pat], rows='', totSat=0, totSpent=0, i;
    var mx=Math.max.apply(null,pr);
    var bars='';
    for(i=0;i<pr.length;i++){
      var sat=pr[i]>0?Math.round(per/pr[i]*1e8/1e6):0; /* satuan sat per juta */
      var satUnit=pr[i]>0?(per/pr[i]):0;
      totSat+=satUnit; totSpent+=per;
      rows+='<tr><td>'+(i+1)+'</td><td class="num">'+num(pr[i])+'</td>'+
        '<td class="num">'+num(satUnit*1e8)+'</td></tr>';
      var hpct=Math.round(satUnit/(per/Math.min.apply(null,pr))*100);
      bars+='<i class="'+(hpct>72?'big':'')+'" style="height:'+Math.max(6,hpct)+'%" title="'+num(pr[i])+'"></i>';
    }
    g('d1-dca').innerHTML=rows;
    g('d1-bars').innerHTML=bars;
    var mine=totSat>0?(totSpent/totSat):0;
    var mkt=pr.reduce(function(a,b){return a+b;},0)/pr.length;
    var diff=mkt-mine;
    g('d1-dcaout').innerHTML=
      '<div class="dc-card"><div class="dc-card-t">'+LD.p3total+'</div>'+
      '<div class="dc-card-v">'+num(totSat*1e8)+' sat</div></div>'+
      '<div class="dc-card"><div class="dc-card-t">'+LD.p3spent+'</div>'+
      '<div class="dc-card-v">'+num(totSpent)+'</div></div>'+
      '<div class="dc-card win"><div class="dc-card-t">'+LD.p3avg+'</div>'+
      '<div class="dc-card-v">'+num(mine,2)+'</div></div>';
    g('d1-mean').innerHTML=
      '<dt>'+LD.p4h+'</dt><dd class="ok">'+num(mine,4)+'</dd>'+
      '<dt>'+LD.p4a+'</dt><dd>'+num(mkt,4)+'</dd>'+
      '<dt>'+LD.p4diff+'</dt><dd class="hl">'+num(diff,4)+'</dd>';
    g('d1-meannote').textContent = (Math.abs(diff)<1e-9? LD.p4eq : LD.p4always);
  }

  function init(){
    if(!g('d1-halv')) return;
    g('d1-amt').addEventListener('input',renderSats);
    g('d1-pop').addEventListener('input',renderSats);
    g('d1-buy').addEventListener('input',renderDCA);
    var seg=g('d1-seg');
    seg.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      pat=b.getAttribute('data-p');
      [].forEach.call(seg.children,function(c){ c.className=(c===b?'on':''); });
      renderDCA();
    });
    renderSats(); renderHalv(); renderDCA();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

/* ============================================================
   LAB · gulirkan item sidebar aktif ke tampilan di layar sempit.
   Tanpa ini, mengklik item di kelompok C atau F memindahkan konten
   tapi meninggalkan penanda aktifnya di luar layar.
============================================================ */
(function(){
  function inStrip(){
    var sb=document.querySelector('#page-bab21 .sidebar');
    return sb && sb.scrollWidth>sb.clientWidth+4;
  }
  function reveal(el){
    var sb=document.querySelector('#page-bab21 .sidebar');
    if(!sb||!el||!inStrip()) return;
    var target=el.offsetLeft-(sb.clientWidth-el.offsetWidth)/2;
    sb.scrollTo({left:Math.max(0,target),behavior:'smooth'});
  }
  function hook(){
    var sb=document.querySelector('#page-bab21 .sidebar');
    if(!sb) return;
    sb.addEventListener('click',function(e){
      var it=e.target.closest('.sidebar-item');
      if(!it||it.classList.contains('lab-soon')) return;
      setTimeout(function(){ reveal(it); },60);
    });
    /* saat halaman Laboratorium dibuka, tampilkan item yang sedang aktif */
    var obs=new MutationObserver(function(){
      var pg=document.getElementById('page-bab21');
      if(pg&&pg.classList.contains('active')){
        setTimeout(function(){ reveal(sb.querySelector('.sidebar-item.active')); },140);
      }
    });
    var pg=document.getElementById('page-bab21');
    if(pg) obs.observe(pg,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook);
  else hook();
})();

var AD=[["p2tr", "P2TR", "bc1p", 34.2, 2021], ["p2pkh", "P2PKH", "1", 28.8, 2009], ["p2wpkh", "P2WPKH", "bc1q", 26.5, 2017], ["other", "P2SH + P2WSH + dll", "3 / bc1q", 10.5, 2012], ["p2pk", "P2PK", "(tanpa address)", 0.03, 2009]];

/* ============================================================
   LAB D2 · SEBARAN JENIS ADDRESS
   Snapshot bertanggal yang ditanam di berkas. Tidak ada permintaan
   jaringan, sehingga halaman ini tetap jalan penuh tanpa internet.
============================================================ */
(function(){
  function g(id){ return document.getElementById(id); }
  var CLS=['a','b','c','d','e'];
  function init(){
    var el=g('d2-bars'); if(!el) return;
    var mx=0,i;
    for(i=0;i<AD.length;i++) if(AD[i][3]>mx) mx=AD[i][3];
    var h='';
    for(i=0;i<AD.length;i++){
      var d=AD[i];
      h+='<div class="ad-row"><span class="ad-name">'+d[1]+'<small>'+d[2]+'</small></span>'+
         '<span class="ad-track"><span class="ad-fill '+CLS[i]+'" style="width:'+
         Math.max(0.6,d[3]/mx*100)+'%"></span></span>'+
         '<span class="ad-pct">'+d[3]+'%</span></div>';
    }
    el.innerHTML=h;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LF={"p1click": "Click a byte chunk above", "p2enc": "Encoded as", "p2bytes": "Size", "p2rule": "Rule applied", "p3full": "Full serialization", "p3core": "Without witness", "p3txid": "txid", "p3wtxid": "wtxid", "p4flip": "Flip one bit of the signature", "p4reset": "Restore", "p4legacy": "Old format (signature in scriptSig)", "p4seg": "SegWit (signature in witness)", "p4before": "Before", "p4after": "After", "p4changed": "CHANGED", "p4same": "unchanged"};
var FL={"version": "Transaction version. Written little-endian, so 02000000 means version 2.", "marker": "SegWit marker. Always 00, and in an old transaction this position would hold an input count, which can never be zero.", "flag": "SegWit flag. Value 01, signalling that witness data follows further down.", "incount": "Number of inputs, as a varint.", "prevtxid": "The txid of the output being spent. Written REVERSED from what you see in a block explorer.", "vout": "Index of the output being spent, counting from zero.", "scriptsiglen": "Length of scriptSig. It is 00 here because SegWit moved its contents into the witness.", "sequence": "nSequence, covered in 15.3. The value fffffffd marks this transaction as replaceable via RBF.", "outcount": "Number of outputs, as a varint.", "value": "Output value in satoshis, little-endian, eight bytes.", "spklen": "Length of the scriptPubKey.", "spk": "The scriptPubKey. It starts with 0014, marking P2WPKH, followed by a 20-byte hash160.", "witcount": "Number of witness items for this input.", "witness": "Witness data: the signature and public key. This is the part that does NOT count toward the txid.", "locktime": "nLockTime, covered in 15.2. Zero means no time lock."};
var FIELDS=[["version", "02000000", "version"], ["marker", "00", "marker"], ["flag", "01", "flag"], ["input count", "01", "incount"], ["prev txid", "5c3a1d8b6f4e2c0a9d7b5e3c1f8a6d4b2e0c9f7a3d1b5e8c6f2a4d9b0e1c3a7f", "prevtxid"], ["vout", "00000000", "vout"], ["scriptSig len", "00", "scriptsiglen"], ["nSequence", "fdffffff", "sequence"], ["output count", "01", "outcount"], ["value", "f04902000000000", "value"], ["scriptPubKey len", "16", "spklen"], ["scriptPubKey", "001489abcdefabbaabbaabbaabbaabbaabbaabbaabba", "spk"], ["witness count", "02", "witcount"], ["witness", "47 3044… 21 02ab…", "witness"], ["nLockTime", "00000000", "locktime"]];
var TX={"seg": "020000000001015c3a1d8b6f4e2c0a9d7b5e3c1f8a6d4b2e0c9f7a3d1b5e8c6f2a4d9b0e1c3a7f0000000000fdffffff01f04902000000000016001489abcdefabbaabbaabbaabbaabbaabbaabbaabba02243044020202020202020202020202020202020202020202020202020202020202020202022102abababababababababababababababababababababababababababababababab00000000", "core": "02000000015c3a1d8b6f4e2c0a9d7b5e3c1f8a6d4b2e0c9f7a3d1b5e8c6f2a4d9b0e1c3a7f0000000000fdffffff01f04902000000000016001489abcdefabbaabbaabbaabbaabbaabbaabbaabba00000000", "legacy": "02000000015c3a1d8b6f4e2c0a9d7b5e3c1f8a6d4b2e0c9f7a3d1b5e8c6f2a4d9b0e1c3a7f000000004825304402020202020202020202020202020202020202020202020202020202020202020202012102ababababababababababababababababababababababababababababababababfdffffff01f04902000000000016001489abcdefabbaabbaabbaabbaabbaabbaabbaabba00000000", "legacySigPos": 83, "segWitPos": 122};

/* ============================================================
   LAB F1 · SERIALISASI TRANSAKSI
   SHA-256 sendiri supaya txid dan wtxid dihitung sungguhan, bukan
   ditanam sebagai teks. Diperiksa terhadap vektor uji di akhir.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n;i++) if(n%i===0){ok=0;break;} if(ok) pr.push(n); n++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));
  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function sha256(bytes){
    var l=bytes.length, m=bytes.slice(); m.push(0x80);
    while(m.length%64!==56) m.push(0);
    var bl=l*8; for(var i=7;i>=0;i--) m.push(Math.floor(bl/Math.pow(2,i*8))&255);
    var H=H0.slice();
    for(var o=0;o<m.length;o+=64){
      var w=[];
      for(var t=0;t<16;t++) w.push(((m[o+t*4]<<24)|(m[o+t*4+1]<<16)|(m[o+t*4+2]<<8)|m[o+t*4+3])>>>0);
      for(var t=16;t<64;t++){
        var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
        var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
        w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
      }
      var v=H.slice();
      for(var t=0;t<64;t++){
        var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
        var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
        var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
        var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
        var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
        v=[(T1+(S0+mj)>>>0)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      }
      for(var t=0;t<8;t++) H[t]=(H[t]+v[t])>>>0;
    }
    var out=[]; for(var t=0;t<8;t++) for(var b=3;b>=0;b--) out.push((H[t]>>>(b*8))&255);
    return out;
  }
  function d256(b){ return sha256(sha256(b)); }
  function hx(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0'+b[i].toString(16)).slice(-2); return s; }
  function un(h){ var b=[]; for(var i=0;i<h.length;i+=2) b.push(parseInt(h.substr(i,2),16)); return b; }
  function rev(h){ return hx(un(h).slice().reverse()); }
  function g(id){ return document.getElementById(id); }

  var COL=['c0','c1','c2','c3','c4'];
  var sel=null, flipped=false;

  function renderHex(){
    var el=g('f1-hex'); if(!el) return;
    var h='';
    for(var i=0;i<FIELDS.length;i++){
      var f=FIELDS[i];
      h+='<span class="'+COL[i%5]+(sel===i?' on':'')+'" data-i="'+i+'">'+f[1]+'</span>';
    }
    el.innerHTML=h;
    g('f1-desc').innerHTML = sel===null ? LF.p1click
      : '<b>'+FIELDS[sel][0]+'</b> \u00b7 '+(FL[FIELDS[sel][2]]||'');
  }

  function viEnc(v){
    if(v<0xfd) return {hex:('0'+v.toString(16)).slice(-2), n:1, rule:'&lt; 253'};
    if(v<=0xffff){ var b=[0xfd,v&255,(v>>8)&255]; return {hex:hx(b),n:3,rule:'fd + 2 byte'}; }
    if(v<=0xffffffff){ var b=[0xfe,v&255,(v>>8)&255,(v>>16)&255,(v>>>24)&255]; return {hex:hx(b),n:5,rule:'fe + 4 byte'}; }
    return {hex:'ff \u2026', n:9, rule:'ff + 8 byte'};
  }
  function renderVi(){
    var v=parseInt(g('f1-vi').value,10); if(isNaN(v)||v<0) v=0;
    var e=viEnc(v);
    g('f1-viout').innerHTML='<dt>'+LF.p2enc+'</dt><dd class="hl">'+e.hex+'</dd>'+
      '<dt>'+LF.p2bytes+'</dt><dd>'+e.n+' byte</dd>'+
      '<dt>'+LF.p2rule+'</dt><dd>'+e.rule+'</dd>';
    var rows=[[0,'&lt; 253','1 byte'],[253,'fd + 2 byte','3 byte'],
              [65536,'fe + 4 byte','5 byte'],[4294967296,'ff + 8 byte','9 byte']];
    var cur = v<0xfd?0 : v<=0xffff?1 : v<=0xffffffff?2 : 3;
    var h='';
    for(var i=0;i<rows.length;i++)
      h+='<tr class="'+(i===cur?'on':'')+'"><td>'+(i===0?'0 \u2026 252':
          i===1?'253 \u2026 65.535':i===2?'65.536 \u2026 4,29 M':'\u2265 4,29 M')+
         '</td><td>'+rows[i][1]+'</td><td>'+rows[i][2]+'</td></tr>';
    g('f1-vitab').innerHTML=h;
  }

  function renderIds(){
    var full=un(TX.seg), core=un(TX.core);
    g('f1-ids').innerHTML=
      '<div><span class="t">'+LF.p3full+'</span><span class="v">'+full.length+' byte</span></div>'+
      '<div><span class="t">'+LF.p3core+'</span><span class="v">'+core.length+' byte</span></div>'+
      '<div class="a"><span class="t">'+LF.p3txid+'</span><span class="v">'+rev(hx(d256(core)))+'</span></div>'+
      '<div class="a"><span class="t">'+LF.p3wtxid+'</span><span class="v">'+rev(hx(d256(full)))+'</span></div>';
  }

  function flipLast(hexStr, pos){
    var b=un(hexStr); b[pos]=b[pos]^1; return b;
  }
  function renderMall(){
    var lg=un(TX.legacy), sg=un(TX.core), sgFull=un(TX.seg);
    var lgT=rev(hx(d256(lg))), sgT=rev(hx(d256(sg)));
    var lg2=lg.slice(), sg2=sgFull.slice();
    if(flipped){ lg2[TX.legacySigPos]^=1; sg2[TX.segWitPos]^=1; }
    var lgT2=rev(hx(d256(lg2)));
    /* txid SegWit dihitung dari inti tanpa witness, jadi membalik bit
       witness tidak menyentuhnya sama sekali. */
    var sgT2=sgT;
    var lgChg=(lgT!==lgT2), sgChg=(sgT!==sgT2);
    g('f1-mall').innerHTML=
      '<div class="tx-box '+(flipped&&lgChg?'bad':'')+'"><h5>'+LF.p4legacy+'</h5>'+
      '<span class="lbl">'+LF.p4before+'</span><code>'+lgT+'</code>'+
      '<span class="lbl">'+LF.p4after+'</span><code>'+lgT2+'</code>'+
      (flipped?'<div class="tx-verd">'+(lgChg?LF.p4changed:LF.p4same)+'</div>':'')+'</div>'+
      '<div class="tx-box '+(flipped&&!sgChg?'good':'')+'"><h5>'+LF.p4seg+'</h5>'+
      '<span class="lbl">'+LF.p4before+'</span><code>'+sgT+'</code>'+
      '<span class="lbl">'+LF.p4after+'</span><code>'+sgT2+'</code>'+
      (flipped?'<div class="tx-verd">'+(sgChg?LF.p4changed:LF.p4same)+'</div>':'')+'</div>';
    g('f1-flip').textContent = flipped ? LF.p4reset : LF.p4flip;
  }

  function init(){
    if(!g('f1-hex')) return;
    g('f1-hex').addEventListener('click',function(e){
      var s=e.target.closest('span[data-i]'); if(!s) return;
      sel=+s.getAttribute('data-i'); renderHex();
    });
    g('f1-vi').addEventListener('input',renderVi);
    g('f1-flip').addEventListener('click',function(){ flipped=!flipped; renderMall(); });
    renderHex(); renderVi(); renderIds(); renderMall();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LK={"p1ver": "Version byte", "p1pay": "Payload (hash160)", "p1raw": "Version + payload", "p1h1": "First SHA-256", "p1h2": "Second SHA-256", "p1chk": "Checksum (first 4 bytes)", "p1addr": "base58check address", "p2hrp": "Network marker (hrp)", "p2ver": "Witness version", "p2data": "Data (5 bits per character)", "p2chk": "Checksum (6 characters)", "p2addr": "bech32 address", "p3ok": "Checksum matches, address accepted", "p3bad": "Checksum fails, address rejected"};
var REF={"h160": "89abcdefabbaabbaabbaabbaabbaabbaabbaabba", "addr58": "1DYwPTpZuLjY2qApmJdHaSAuWRvEF5skCN", "chk58": "fe49c62f", "addrbc": "bc1q3x4ummath24m42a64wa2hw4th24m42a6rul9r7", "chkbc": "rul9r7"};

/* ============================================================
   LAB F2 · CHECKSUM ADDRESS
   base58check dan bech32 dihitung sungguhan, bukan ditanam sebagai teks.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n;i++) if(n%i===0){ok=0;break;} if(ok) pr.push(n); n++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));
  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function sha256(bytes){
    var l=bytes.length,m=bytes.slice(); m.push(0x80);
    while(m.length%64!==56) m.push(0);
    var bl=l*8; for(var i=7;i>=0;i--) m.push(Math.floor(bl/Math.pow(2,i*8))&255);
    var H=H0.slice();
    for(var o=0;o<m.length;o+=64){
      var w=[];
      for(var t=0;t<16;t++) w.push(((m[o+t*4]<<24)|(m[o+t*4+1]<<16)|(m[o+t*4+2]<<8)|m[o+t*4+3])>>>0);
      for(var t=16;t<64;t++){
        var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
        var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
        w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
      }
      var v=H.slice();
      for(var t=0;t<64;t++){
        var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
        var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
        var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
        var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
        var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
        v=[(T1+(S0+mj)>>>0)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      }
      for(var t=0;t<8;t++) H[t]=(H[t]+v[t])>>>0;
    }
    var out=[]; for(var t=0;t<8;t++) for(var b=3;b>=0;b--) out.push((H[t]>>>(b*8))&255);
    return out;
  }
  function hx(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0'+b[i].toString(16)).slice(-2); return s; }
  function un(h){ var b=[]; for(var i=0;i<h.length;i+=2) b.push(parseInt(h.substr(i,2),16)); return b; }
  var B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  function b58enc(bytes){
    var digits=[0],i,j;
    for(i=0;i<bytes.length;i++){
      var carry=bytes[i];
      for(j=0;j<digits.length;j++){ carry+=digits[j]<<8; digits[j]=carry%58; carry=(carry/58)|0; }
      while(carry){ digits.push(carry%58); carry=(carry/58)|0; }
    }
    var s='';
    for(i=0;i<bytes.length&&bytes[i]===0;i++) s+='1';
    for(j=digits.length-1;j>=0;j--) s+=B58[digits[j]];
    return s;
  }
  function b58dec(str){
    var bytes=[0],i,j;
    for(i=0;i<str.length;i++){
      var p=B58.indexOf(str[i]); if(p<0) return null;
      var carry=p;
      for(j=0;j<bytes.length;j++){ carry+=bytes[j]*58; bytes[j]=carry&255; carry>>=8; }
      while(carry){ bytes.push(carry&255); carry>>=8; }
    }
    for(i=0;i<str.length&&str[i]==='1';i++) bytes.push(0);
    return bytes.reverse();
  }
  var CH='qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  var GEN=[0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];
  function polymod(v){
    var c=1;
    for(var i=0;i<v.length;i++){
      var b=c>>25; c=((c&0x1ffffff)<<5)^v[i];
      for(var j=0;j<5;j++) if((b>>j)&1) c^=GEN[j];
    }
    return c;
  }
  function hrpexp(h){
    var a=[],b=[];
    for(var i=0;i<h.length;i++){ a.push(h.charCodeAt(i)>>5); b.push(h.charCodeAt(i)&31); }
    return a.concat([0],b);
  }
  function conv(d,f,t,pad){
    var acc=0,bits=0,ret=[],mx=(1<<t)-1;
    for(var i=0;i<d.length;i++){
      acc=(acc<<f)|d[i]; bits+=f;
      while(bits>=t){ bits-=t; ret.push((acc>>bits)&mx); }
    }
    if(pad&&bits) ret.push((acc<<(t-bits))&mx);
    return ret;
  }
  function bech32(hrp,ver,prog,konst){
    var data=[ver].concat(conv(prog,8,5,true));
    var pm=polymod(hrpexp(hrp).concat(data,[0,0,0,0,0,0]))^konst;
    var chk=[]; for(var i=0;i<6;i++) chk.push((pm>>5*(5-i))&31);
    var s=''; for(i=0;i<data.length;i++) s+=CH[data[i]];
    var c=''; for(i=0;i<6;i++) c+=CH[chk[i]];
    return {addr:hrp+'1'+s+c, chk:c};
  }
  function okB58(a){
    var b=b58dec(a); if(!b||b.length!==25) return false;
    var body=b.slice(0,21), chk=b.slice(21);
    var h=sha256(sha256(body));
    for(var i=0;i<4;i++) if(h[i]!==chk[i]) return false;
    return true;
  }
  function okBech(a){
    a=a.toLowerCase(); var p=a.lastIndexOf('1'); if(p<1) return false;
    var hrp=a.slice(0,p), data=a.slice(p+1), d=[];
    for(var i=0;i<data.length;i++){ var q=CH.indexOf(data[i]); if(q<0) return false; d.push(q); }
    return polymod(hrpexp(hrp).concat(d))===1;
  }
  function g(id){ return document.getElementById(id); }

  var H160=un(REF.h160), A58='', ABC='', pos58=null, posbc=null;

  function renderB58(){
    var body=[0].concat(H160);
    var h1=sha256(body), h2=sha256(h1), chk=h2.slice(0,4);
    A58=b58enc(body.concat(chk));
    g('f2-b58').innerHTML=
      '<div><span class="t">'+LK.p1ver+'</span><span class="v">00</span></div>'+
      '<div><span class="t">'+LK.p1pay+'</span><span class="v">'+hx(H160)+'</span></div>'+
      '<div><span class="t">'+LK.p1raw+'</span><span class="v">'+hx(body)+'</span></div>'+
      '<div><span class="t">'+LK.p1h1+'</span><span class="v">'+hx(h1)+'</span></div>'+
      '<div><span class="t">'+LK.p1h2+'</span><span class="v">'+hx(h2)+'</span></div>'+
      '<div class="hot"><span class="t">'+LK.p1chk+'</span><span class="v">'+hx(chk)+'</span></div>'+
      '<div class="out"><span class="t">'+LK.p1addr+'</span><span class="v">'+A58+'</span></div>';
  }
  function renderBech(){
    var r=bech32('bc',0,H160,1); ABC=r.addr;
    g('f2-bc').innerHTML=
      '<div><span class="t">'+LK.p2hrp+'</span><span class="v">bc</span></div>'+
      '<div><span class="t">'+LK.p2ver+'</span><span class="v">0</span></div>'+
      '<div><span class="t">'+LK.p2data+'</span><span class="v">'+hx(H160)+'</span></div>'+
      '<div class="hot"><span class="t">'+LK.p2chk+'</span><span class="v">'+r.chk+'</span></div>'+
      '<div class="out"><span class="t">'+LK.p2addr+'</span><span class="v">'+ABC+'</span></div>';
  }
  function shift(c,alpha){ var i=alpha.indexOf(c); return alpha[(i+1)%alpha.length]; }
  function renderTamper(){
    function draw(id,addr,pos,alpha,valid,chkFrom){
      var broken = pos===null ? addr :
        addr.slice(0,pos)+shift(addr[pos],alpha)+addr.slice(pos+1);
      var h='';
      for(var i=0;i<addr.length;i++)
        h+='<i data-p="'+i+'" class="'+(i===pos?'hit':(i>=chkFrom?'chk':''))+'">'+broken[i]+'</i>';
      g(id).innerHTML=h;
      var v=g(id+'-v'), ok=valid(broken);
      v.className='ck-verd '+(ok?'ok':'no');
      v.textContent=(ok?LK.p3ok:LK.p3bad);
    }
    draw('f2-t58',A58,pos58,B58,okB58,A58.length-6);
    draw('f2-tbc',ABC,posbc,CH,okBech,ABC.length-6);
  }
  function init(){
    if(!g('f2-b58')) return;
    renderB58(); renderBech(); renderTamper();
    g('f2-t58').addEventListener('click',function(e){
      var s=e.target.closest('i[data-p]'); if(!s) return;
      var p=+s.getAttribute('data-p'); pos58=(pos58===p?null:p); renderTamper();
    });
    g('f2-tbc').addEventListener('click',function(e){
      var s=e.target.closest('i[data-p]'); if(!s) return;
      var p=+s.getAttribute('data-p');
      if(p<3) return;  /* jangan sentuh penanda jaringan */
      posbc=(posbc===p?null:p); renderTamper();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LANGN="en";
var LN={"p1nbits": "nBits", "p1exp": "Exponent (byte 1)", "p1man": "Mantissa (bytes 2 to 4)", "p1len": "Target length", "p1diff": "Difficulty", "p3hdr": "Block header size", "p3if": "If the target were stored in full", "p3save": "Saved", "p4zero": "Leading hex zeros", "p4res": "Representing nBits", "p4work": "Work relative to difficulty 1"};
var HIST=[[486604799, "genesis"], [453248203, "2011"], [419668748, "2013"], [386846955, "2022"], [386089497, "2024"]];

/* ============================================================
   LAB F3 · ENCODING nBits
   Decode dan encode dihitung sungguhan, cocok dengan Bitcoin Core.
============================================================ */
(function(){
  function g(id){ return document.getElementById(id); }
  var MAXT = null;
  function decode(nb){
    var exp = nb >>> 24, man = nb & 0x007fffff;
    var hex = man.toString(16); while(hex.length<6) hex='0'+hex;
    if(exp<=3){ /* jarang dipakai di Bitcoin, tapi ditangani supaya jujur */
      var shift=8*(3-exp), v=man>>>shift;
      var h=v.toString(16); while(h.length<64) h='0'+h; return h;
    }
    var zeros = exp-3;
    var s = hex + Array(zeros+1).join('00');
    while(s.length<64) s='0'+s;
    return s.slice(-64);
  }
  function toBig(hex){ return BigInt('0x'+hex); }
  function diffOf(hex){
    if(MAXT===null) MAXT=toBig(decode(0x1d00ffff));
    var t=toBig(hex); if(t===0n) return '\u221e';
    var num=MAXT*1000000n/t;
    var whole=num/1000000n, frac=(num%1000000n).toString().padStart(6,'0');
    return whole.toLocaleString(LANGN==='id'?'id-ID':'en-US')+','+frac.slice(0,4);
  }
  function encode(hexTarget){
    var h=hexTarget.replace(/^0+/,''); if(!h) h='0';
    if(h.length%2) h='0'+h;
    var bytes=h.length/2;
    if(parseInt(h.slice(0,2),16)&0x80){ h='00'+h; bytes++; }
    var man=parseInt((h+'0000').slice(0,6),16);
    return ((bytes<<24)|man)>>>0;
  }
  function fmtTarget(hex){
    var lead=hex.length-hex.replace(/^0+/,'').length;
    var body=hex.slice(lead), sig=body.slice(0,6), rest=body.slice(6);
    return '<u>'+hex.slice(0,lead)+'</u><b>'+sig+'</b><u>'+rest+'</u>';
  }
  var st={exp:29, man:0x00ffff, zero:8};

  function render1(){
    var nb=((st.exp<<24)|st.man)>>>0;
    var hex=('00000000'+nb.toString(16)).slice(-8);
    g('f3-word').innerHTML='<i class="e">'+hex.slice(0,2)+'</i>'+
      '<i class="m">'+hex.slice(2,4)+'</i><i class="m">'+hex.slice(4,6)+'</i><i class="m">'+hex.slice(6,8)+'</i>';
    var t=decode(nb);
    g('f3-out').innerHTML=
      '<dt>'+LN.p1nbits+'</dt><dd class="hl">0x'+hex+'</dd>'+
      '<dt>'+LN.p1exp+'</dt><dd>'+st.exp+'</dd>'+
      '<dt>'+LN.p1man+'</dt><dd>0x'+('000000'+st.man.toString(16)).slice(-6)+'</dd>'+
      '<dt>'+LN.p1len+'</dt><dd>'+st.exp+' byte</dd>'+
      '<dt>'+LN.p1diff+'</dt><dd class="ok">'+diffOf(t)+'</dd>';
    g('f3-target').innerHTML=fmtTarget(t);
    g('f3-expv').textContent='exp = '+st.exp;
    g('f3-manv').textContent='mantissa = 0x'+('000000'+st.man.toString(16)).slice(-6);
  }
  function renderHist(){
    var h='';
    for(var i=0;i<HIST.length;i++){
      var nb=HIST[i][0];
      h+='<tr data-nb="'+nb+'"><td>'+HIST[i][1]+'</td><td>0x'+
         ('00000000'+nb.toString(16)).slice(-8)+'</td><td class="num">'+(nb>>>24)+
         '</td><td class="num">'+diffOf(decode(nb))+'</td></tr>';
    }
    g('f3-hist').innerHTML=h;
  }
  function renderWhy(){
    g('f3-why').innerHTML=
      '<div class="nb-card good"><div class="nb-card-t">'+LN.p3hdr+'</div>'+
      '<div class="nb-card-v">80 byte</div></div>'+
      '<div class="nb-card warn"><div class="nb-card-t">'+LN.p3if+'</div>'+
      '<div class="nb-card-v">108 byte</div></div>'+
      '<div class="nb-card"><div class="nb-card-t">'+LN.p3save+'</div>'+
      '<div class="nb-card-v">28 byte</div></div>';
  }
  function renderRev(){
    var z=st.zero;
    var hex=Array(z+1).join('0')+'ffff'+Array(64-z-4+1).join('0');
    hex=hex.slice(0,64);
    var nb=encode(hex);
    g('f3-rev').innerHTML=
      '<dt>'+LN.p4zero+'</dt><dd class="hl">'+z+'</dd>'+
      '<dt>'+LN.p4res+'</dt><dd>0x'+('00000000'+nb.toString(16)).slice(-8)+'</dd>'+
      '<dt>'+LN.p4work+'</dt><dd class="ok">'+diffOf(hex)+'</dd>';
    g('f3-revt').innerHTML=fmtTarget(hex);
    g('f3-zerov').textContent=z+' nol';
  }
  function init(){
    if(!g('f3-word')) return;
    g('f3-exp').addEventListener('input',function(e){ st.exp=+e.target.value; render1(); });
    g('f3-man').addEventListener('input',function(e){ st.man=+e.target.value; render1(); });
    g('f3-zero').addEventListener('input',function(e){ st.zero=+e.target.value; renderRev(); });
    g('f3-hist').addEventListener('click',function(e){
      var tr=e.target.closest('tr[data-nb]'); if(!tr) return;
      var nb=+tr.getAttribute('data-nb');
      st.exp=nb>>>24; st.man=nb&0x007fffff;
      g('f3-exp').value=st.exp; g('f3-man').value=st.man;
      [].forEach.call(g('f3-hist').children,function(r){ r.className=(r===tr?'on':''); });
      render1();
    });
    render1(); renderHist(); renderWhy(); renderRev();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LB={"p1ent": "Entropy", "p1bits": "Length", "p1gen": "Regenerate", "p2hash": "SHA-256 of the entropy", "p2take": "Checksum bits taken", "p2total": "Total bits", "p2div": "Divisible by 11", "p4valid": "Checksum matches, seed valid", "p4invalid": "Checksum fails, seed rejected"};
var WL=["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant", "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion", "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite", "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final", "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flash", "flat", "flavor", "flee", "flight", "flip", "float", "flock", "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward", "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue", "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown", "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid", "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt", "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy", "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health", "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden", "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole", "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital", "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred", "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea", "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune", "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate", "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install", "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue", "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel", "job", "join", "joke", "journey", "joy", "judge", "juice", "jump", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder", "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave", "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens", "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift", "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live", "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop", "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math", "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal", "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit", "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix", "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster", "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain", "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom", "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow", "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew", "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night", "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off", "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once", "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange", "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor", "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet", "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge", "poem", "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "popular", "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit", "program", "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public", "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity", "purpose", "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require", "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river", "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose", "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run", "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat", "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft", "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe", "shoot", "shop", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender", "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge", "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent", "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they", "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast", "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual", "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage", "use", "used", "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet", "vendor", "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa", "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat", "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild", "will", "win", "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"];

/* ============================================================
   LAB C5 · BIP39
   SHA-256 sendiri, wordlist resmi 2048 kata ditanam utuh.
   Diperiksa terhadap vektor uji resmi BIP39.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n;i++) if(n%i===0){ok=0;break;} if(ok) pr.push(n); n++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));
  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function sha256(bytes){
    var l=bytes.length,m=bytes.slice(); m.push(0x80);
    while(m.length%64!==56) m.push(0);
    var bl=l*8; for(var i=7;i>=0;i--) m.push(Math.floor(bl/Math.pow(2,i*8))&255);
    var H=H0.slice();
    for(var o=0;o<m.length;o+=64){
      var w=[];
      for(var t=0;t<16;t++) w.push(((m[o+t*4]<<24)|(m[o+t*4+1]<<16)|(m[o+t*4+2]<<8)|m[o+t*4+3])>>>0);
      for(var t=16;t<64;t++){
        var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
        var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
        w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
      }
      var v=H.slice();
      for(var t=0;t<64;t++){
        var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
        var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
        var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
        var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
        var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
        v=[(T1+(S0+mj)>>>0)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      }
      for(var t=0;t<8;t++) H[t]=(H[t]+v[t])>>>0;
    }
    var out=[]; for(var t=0;t<8;t++) for(var b=3;b>=0;b--) out.push((H[t]>>>(b*8))&255);
    return out;
  }
  function hx(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0'+b[i].toString(16)).slice(-2); return s; }
  function bin8(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0000000'+b[i].toString(2)).slice(-8); return s; }
  function g(id){ return document.getElementById(id); }

  var st={ent:[], size:16, edit:null};
  function gen(){
    var a=new Uint8Array(st.size);
    if(window.crypto&&crypto.getRandomValues) crypto.getRandomValues(a);
    else for(var i=0;i<st.size;i++) a[i]=Math.floor(Math.random()*256);
    st.ent=Array.from(a); st.edit=null;
  }
  function build(ent){
    var h=sha256(ent), cs=ent.length*8/32;
    var bits=bin8(ent)+bin8(h).slice(0,cs);
    var idx=[]; for(var i=0;i<bits.length;i+=11) idx.push(parseInt(bits.slice(i,i+11),2));
    return {bits:bits, cs:cs, idx:idx, hash:h, words:idx.map(function(i){return WL[i];})};
  }
  function checkIdx(idx, entBits){
    /* susun ulang bit dari indeks, lalu hitung ulang checksumnya */
    var bits=''; for(var i=0;i<idx.length;i++) bits+=('00000000000'+idx[i].toString(2)).slice(-11);
    var cs=bits.length/33, entLen=bits.length-cs;
    var eb=bits.slice(0,entLen), cb=bits.slice(entLen);
    var by=[]; for(var i=0;i<entLen;i+=8) by.push(parseInt(eb.slice(i,i+8),2));
    return bin8(sha256(by)).slice(0,cs)===cb;
  }
  function render(){
    var m=build(st.ent);
    /* --- 1. entropi --- */
    var bh='';
    for(var i=0;i<m.bits.length;i++)
      bh+='<i class="'+(i<st.ent.length*8?'ent':'chk')+'">'+m.bits[i]+'</i>';
    g('c5-bits').innerHTML=bh;
    g('c5-ent').innerHTML='<dt>'+LB.p1ent+'</dt><dd class="hl">'+hx(st.ent)+'</dd>'+
      '<dt>'+LB.p1bits+'</dt><dd>'+(st.ent.length*8)+' bit</dd>';
    /* --- 2. checksum --- */
    g('c5-chk').innerHTML='<dt>'+LB.p2hash+'</dt><dd>'+hx(m.hash)+'</dd>'+
      '<dt>'+LB.p2take+'</dt><dd class="hl">'+m.bits.slice(-m.cs)+' ('+m.cs+' bit)</dd>'+
      '<dt>'+LB.p2total+'</dt><dd>'+m.bits.length+' bit</dd>'+
      '<dt>'+LB.p2div+'</dt><dd class="ok">'+m.bits.length+' / 11 = '+(m.bits.length/11)+'</dd>';
    /* --- 3. potongan --- */
    var rows='';
    for(var i=0;i<m.idx.length;i++){
      var b=m.bits.slice(i*11,i*11+11), akhir=(i===m.idx.length-1);
      rows+='<tr class="'+(akhir?'last':'')+'"><td>'+(i+1)+'</td><td>'+b+'</td>'+
            '<td>'+m.idx[i]+'</td><td>'+WL[m.idx[i]]+'</td></tr>';
    }
    g('c5-tab').innerHTML=rows;
    /* --- 4. kata & uji --- */
    var idx=m.idx.slice();
    if(st.edit) idx[st.edit.pos]=st.edit.idx;
    var wh='';
    for(var i=0;i<idx.length;i++){
      var akhir=(i===idx.length-1), diedit=(st.edit&&st.edit.pos===i);
      wh+='<div class="b9-w '+(diedit?'edit':(akhir?'mix':''))+'">'+
          '<span class="n">'+(i+1)+' \u00b7 #'+idx[i]+'</span>'+
          '<b>'+WL[idx[i]]+'</b></div>';
    }
    g('c5-words').innerHTML=wh;
    var sel=g('c5-pos'), o='';
    for(var i=0;i<idx.length;i++) o+='<option value="'+i+'">'+(i+1)+'</option>';
    if(sel.options.length!==idx.length){ sel.innerHTML=o; }
    var valid=checkIdx(idx);
    var v=g('c5-verd');
    v.className='ec-verdict '+(valid?'ok':'no');
    v.textContent=valid?LB.p4valid:LB.p4invalid;
  }
  function init(){
    if(!g('c5-bits')) return;
    gen(); render();
    g('c5-gen').addEventListener('click',function(){ gen(); render(); });
    g('c5-size').addEventListener('change',function(e){
      st.size=+e.target.value; gen(); render();
    });
    g('c5-swap').addEventListener('click',function(){
      var pos=+g('c5-pos').value;
      var m=build(st.ent), cur=m.idx[pos];
      var baru=(cur+1+Math.floor(Math.random()*2047))%2048;
      st.edit={pos:pos, idx:baru}; render();
    });
    g('c5-restore').addEventListener('click',function(){ st.edit=null; render(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LT={"p1d_": "Private key d", "p1P": "P = d × G (internal key)", "p2root": "Script tree merkle root", "p2t_": "t = hash(P, merkle root) mod n", "p2Q": "Q = P + t × G (output key)", "p2none": "(no script tree)", "p3r1": "Route 1: P + t × G", "p3r2": "Route 2: (d + t) × G", "p3same": "Identical, as it should be", "p3diff": "Different, something is wrong", "p3inf": "Special case: d + t is divisible by n, so the result is the point at infinity. On this toy curve that can happen. On secp256k1, whose order is prime and around 10⁷⁷, the chance is effectively zero and real implementations reject it."};

/* ============================================================
   LAB C6 · TWEAK TAPROOT
   Kurva mainan sama dengan C2: y^2 = x^3 + 7 mod 17, G = (6,6), n = 18.
   Tagged hash memakai SHA-256 sungguhan.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n2=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n2;i++) if(n2%i===0){ok=0;break;} if(ok) pr.push(n2); n2++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));
  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function sha256(bytes){
    var l=bytes.length,m=bytes.slice(); m.push(0x80);
    while(m.length%64!==56) m.push(0);
    var bl=l*8; for(var i=7;i>=0;i--) m.push(Math.floor(bl/Math.pow(2,i*8))&255);
    var H=H0.slice();
    for(var o=0;o<m.length;o+=64){
      var w=[];
      for(var t=0;t<16;t++) w.push(((m[o+t*4]<<24)|(m[o+t*4+1]<<16)|(m[o+t*4+2]<<8)|m[o+t*4+3])>>>0);
      for(var t=16;t<64;t++){
        var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
        var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
        w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
      }
      var v=H.slice();
      for(var t=0;t<64;t++){
        var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
        var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
        var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
        var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
        var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
        v=[(T1+(S0+mj)>>>0)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      }
      for(var t=0;t<8;t++) H[t]=(H[t]+v[t])>>>0;
    }
    var out=[]; for(var t=0;t<8;t++) for(var b=3;b>=0;b--) out.push((H[t]>>>(b*8))&255);
    return out;
  }
  var P=17, N=18, G=[6,6];
  function md(a){ return ((a%P)+P)%P; }
  function invP(a){ var r=1,b=md(a),e=P-2; while(e>0){ if(e&1) r=r*b%P; b=b*b%P; e>>=1; } return r; }
  function eq(u,v){ return (!u&&!v)||(!!u&&!!v&&u[0]===v[0]&&u[1]===v[1]); }
  function addP(p1,p2){
    if(!p1) return p2?p2.slice():null;
    if(!p2) return p1.slice();
    if(p1[0]===p2[0] && md(p1[1]+p2[1])===0) return null;
    var l=(p1[0]===p2[0]&&p1[1]===p2[1]) ? md(3*p1[0]*p1[0]*invP(2*p1[1]))
        : md((p2[1]-p1[1])*invP(p2[0]-p1[0]));
    var x=md(l*l-p1[0]-p2[0]);
    return [x, md(l*(p1[0]-x)-p1[1])];
  }
  function mul(k,B){ B=B||G; var R=null; k=((k%N)+N)%N; for(var i=0;i<k;i++) R=addP(R,B); return R; }
  function taggedT(Px, rootHex){
    var tag=sha256(Array.from(new TextEncoder().encode('TapTweak')));
    var msg=tag.concat(tag,[Px]);
    for(var i=0;i<rootHex.length;i+=2) msg.push(parseInt(rootHex.substr(i,2),16));
    var h=sha256(msg), acc=0;
    for(var i=0;i<h.length;i++) acc=(acc*256+h[i])%N;
    return acc;
  }
  function fp(p){ return p?('('+p[0]+', '+p[1]+')'):'\u221e'; }
  function g(id){ return document.getElementById(id); }
  var st={d:7, root:'aabb'};

  function render(){
    var Pp=mul(st.d);
    if(!Pp){ g('c6-int').innerHTML='<div><span class="v">d tidak sah</span></div>'; return; }
    var t=taggedT(Pp[0], st.root);
    var Q1=addP(Pp, mul(t)), Q2=mul(st.d+t);
    g('c6-int').innerHTML=
      '<div><span class="t">'+LT.p1d_+'</span><span class="v">'+st.d+'</span></div>'+
      '<div class="hot"><span class="t">'+LT.p1P+'</span><span class="v">'+fp(Pp)+'</span></div>';
    g('c6-tw').innerHTML=
      '<div><span class="t">'+LT.p2root+'</span><span class="v">'+(st.root||LT.p2none)+'</span></div>'+
      '<div class="hot"><span class="t">'+LT.p2t_+'</span><span class="v">t = '+t+'</span></div>'+
      '<div><span class="t">t \u00d7 G</span><span class="v">'+fp(mul(t))+'</span></div>'+
      '<div class="out"><span class="t">'+LT.p2Q+'</span><span class="v">'+fp(Q1)+'</span></div>';
    g('c6-two').innerHTML=
      '<div class="tw-box"><h6>'+LT.p3r1+'</h6><div class="p">'+fp(Q1)+'</div></div>'+
      '<div class="tw-box"><h6>'+LT.p3r2+'</h6><div class="p">'+fp(Q2)+'</div></div>';
    var v=g('c6-eq');
    if(!Q1&&!Q2){ v.className='tw-eq inf'; v.textContent=LT.p3inf; }
    else { var same=eq(Q1,Q2); v.className='tw-eq '+(same?'ok':'no');
           v.textContent=(same?LT.p3same:LT.p3diff)+'  \u00b7  '+fp(Q1)+' = '+fp(Q2); }
    g('c6-dt').textContent='d + t = '+st.d+' + '+t+' = '+((st.d+t)%N)+' (mod '+N+')';
    g('c6-dval').textContent='d = '+st.d;
  }
  function init(){
    if(!g('c6-int')) return;
    g('c6-d').addEventListener('input',function(e){ st.d=+e.target.value; render(); });
    g('c6-root').addEventListener('change',function(e){ st.root=e.target.value; render(); });
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var SHA512K=["428a2f98d728ae22", "7137449123ef65cd", "b5c0fbcfec4d3b2f", "e9b5dba58189dbbc", "3956c25bf348b538", "59f111f1b605d019", "923f82a4af194f9b", "ab1c5ed5da6d8118", "d807aa98a3030242", "12835b0145706fbe", "243185be4ee4b28c", "550c7dc3d5ffb4e2", "72be5d74f27b896f", "80deb1fe3b1696b1", "9bdc06a725c71235", "c19bf174cf692694", "e49b69c19ef14ad2", "efbe4786384f25e3", "0fc19dc68b8cd5b5", "240ca1cc77ac9c65", "2de92c6f592b0275", "4a7484aa6ea6e483", "5cb0a9dcbd41fbd4", "76f988da831153b5", "983e5152ee66dfab", "a831c66d2db43210", "b00327c898fb213f", "bf597fc7beef0ee4", "c6e00bf33da88fc2", "d5a79147930aa725", "06ca6351e003826f", "142929670a0e6e70", "27b70a8546d22ffc", "2e1b21385c26c926", "4d2c6dfc5ac42aed", "53380d139d95b3df", "650a73548baf63de", "766a0abb3c77b2a8", "81c2c92e47edaee6", "92722c851482353b", "a2bfe8a14cf10364", "a81a664bbc423001", "c24b8b70d0f89791", "c76c51a30654be30", "d192e819d6ef5218", "d69906245565a910", "f40e35855771202a", "106aa07032bbd1b8", "19a4c116b8d2d0c8", "1e376c085141ab53", "2748774cdf8eeb99", "34b0bcb5e19b48a8", "391c0cb3c5c95a63", "4ed8aa4ae3418acb", "5b9cca4f7763e373", "682e6ff3d6b2b8a3", "748f82ee5defb2fc", "78a5636f43172f60", "84c87814a1f0ab72", "8cc702081a6439ec", "90befffa23631e28", "a4506cebde82bde9", "bef9a3f7b2c67915", "c67178f2e372532b", "ca273eceea26619c", "d186b8c721c0c207", "eada7dd6cde0eb1e", "f57d4f7fee6ed178", "06f067aa72176fba", "0a637dc5a2c898a6", "113f9804bef90dae", "1b710b35131c471b", "28db77f523047d84", "32caab7b40c72493", "3c9ebe0a15c9bebc", "431d67c49c100d4c", "4cc5d4becb3e42b6", "597f299cfc657e2a", "5fcb6fab3ad6faec", "6c44198c4a475817"];
var SHA512H=["6a09e667f3bcc908", "bb67ae8584caa73b", "3c6ef372fe94f82b", "a54ff53a5f1d36f1", "510e527fade682d1", "9b05688c2b3e6c1f", "1f83d9abfb41bd6b", "5be0cd19137e2179"];
var LH={"p1seed": "Seed", "p1hmac": "HMAC-SHA512 (key: \"Bitcoin seed\")", "p1il": "IL: master private key", "p1ir": "IR: chain code", "p2idx": "Child index", "p2data": "HMAC input", "p2il": "Child IL", "p2child": "Child key = (IL + parent key) mod n", "p2cc": "Child chain code", "p4leak": "Leak one child key", "p4reset": "Reset", "p4have": "What the attacker holds", "p4step": "Recovery step", "p4orig": "The real parent private key", "p4win": "Identical, the whole wallet falls", "p4safe": "Nothing has leaked yet"};

/* ============================================================
   LAB C4 · BIP32
   HMAC-SHA512 dan aritmetika secp256k1 dihitung sungguhan dengan BigInt.
   Diperiksa terhadap vektor uji resmi BIP32.
============================================================ */
(function(){
  var M64=(1n<<64n)-1n;
  var K=SHA512K.map(function(h){return BigInt('0x'+h);});
  var H0=SHA512H.map(function(h){return BigInt('0x'+h);});
  function rr(x,n){ return ((x>>n)|(x<<(64n-n)))&M64; }
  function sha512(bytes){
    var l=bytes.length, m=bytes.slice(); m.push(0x80);
    while(m.length%128!==112) m.push(0);
    for(var i=0;i<8;i++) m.push(0);
    var bl=BigInt(l)*8n;
    for(var i=7;i>=0;i--) m.push(Number((bl>>BigInt(i*8))&0xffn));
    var H=H0.slice();
    for(var o=0;o<m.length;o+=128){
      var w=[];
      for(var t=0;t<16;t++){
        var v=0n; for(var b=0;b<8;b++) v=(v<<8n)|BigInt(m[o+t*8+b]);
        w.push(v);
      }
      for(var t=16;t<80;t++){
        var s0=(rr(w[t-15],1n)^rr(w[t-15],8n)^(w[t-15]>>7n))&M64;
        var s1=(rr(w[t-2],19n)^rr(w[t-2],61n)^(w[t-2]>>6n))&M64;
        w.push((w[t-16]+s0+w[t-7]+s1)&M64);
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g2=H[6],h=H[7];
      for(var t=0;t<80;t++){
        var S1=(rr(e,14n)^rr(e,18n)^rr(e,41n))&M64;
        var ch=((e&f)^((~e&M64)&g2))&M64;
        var T1=(h+S1+ch+K[t]+w[t])&M64;
        var S0=(rr(a,28n)^rr(a,34n)^rr(a,39n))&M64;
        var mj=((a&b)^(a&c)^(b&c))&M64;
        var T2=(S0+mj)&M64;
        h=g2; g2=f; f=e; e=(d+T1)&M64; d=c; c=b; b=a; a=(T1+T2)&M64;
      }
      H=[(H[0]+a)&M64,(H[1]+b)&M64,(H[2]+c)&M64,(H[3]+d)&M64,
         (H[4]+e)&M64,(H[5]+f)&M64,(H[6]+g2)&M64,(H[7]+h)&M64];
    }
    var out=[];
    for(var t=0;t<8;t++) for(var b=7;b>=0;b--) out.push(Number((H[t]>>BigInt(b*8))&0xffn));
    return out;
  }
  function hmac512(key,msg){
    var k=key.slice();
    if(k.length>128) k=sha512(k);
    while(k.length<128) k.push(0);
    var ip=[],op=[];
    for(var i=0;i<128;i++){ ip.push(k[i]^0x36); op.push(k[i]^0x5c); }
    return sha512(op.concat(sha512(ip.concat(msg))));
  }
  var Pm=BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
  var Nn=BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
  var Gp=[BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
          BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8')];
  function mod(a,m){ return ((a%m)+m)%m; }
  function inv(a,m){ var r=1n,b=mod(a,m),e=m-2n; while(e>0n){ if(e&1n) r=mod(r*b,m); b=mod(b*b,m); e>>=1n; } return r; }
  function padd(p,q){
    if(!p) return q; if(!q) return p;
    if(p[0]===q[0] && mod(p[1]+q[1],Pm)===0n) return null;
    var l = (p[0]===q[0]&&p[1]===q[1])
      ? mod(3n*p[0]*p[0]*inv(2n*p[1],Pm),Pm)
      : mod((q[1]-p[1])*inv(mod(q[0]-p[0],Pm),Pm),Pm);
    var x=mod(l*l-p[0]-q[0],Pm);
    return [x, mod(l*(p[0]-x)-p[1],Pm)];
  }
  function pmul(k){ var R=null,B=Gp; k=mod(k,Nn); while(k>0n){ if(k&1n) R=padd(R,B); B=padd(B,B); k>>=1n; } return R; }
  function hx(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0'+b[i].toString(16)).slice(-2); return s; }
  function un(h){ var b=[]; for(var i=0;i<h.length;i+=2) b.push(parseInt(h.substr(i,2),16)); return b; }
  function b32(n){ return n.toString(16).padStart(64,'0'); }
  function ser33(pt){ return [pt[1]%2n===0n?2:3].concat(un(b32(pt[0]))); }
  function i32(n){ return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]; }
  function g(id){ return document.getElementById(id); }

  var SEED=un('000102030405060708090a0b0c0d0e0f');
  var st={idx:0, leak:false, master:null};

  function master(){
    if(st.master) return st.master;
    var I=hmac512(Array.from(new TextEncoder().encode('Bitcoin seed')), SEED);
    st.master={k:BigInt('0x'+hx(I.slice(0,32))), c:I.slice(32), I:I};
    return st.master;
  }
  function ckd(k,c,i){
    var data = (i>=0x80000000)
      ? [0].concat(un(b32(k)), i32(i))
      : ser33(pmul(k)).concat(i32(i));
    var I=hmac512(c,data);
    var IL=BigInt('0x'+hx(I.slice(0,32)));
    return {k:mod(IL+k,Nn), c:I.slice(32), IL:IL, data:data};
  }
  function render(){
    var m=master();
    g('c4-master').innerHTML=
      '<div><span class="t">'+LH.p1seed+'</span><span class="v">'+hx(SEED)+'</span></div>'+
      '<div><span class="t">'+LH.p1hmac+'</span><span class="v">'+hx(m.I)+'</span></div>'+
      '<div class="l"><span class="t">'+LH.p1il+'</span><span class="v">'+b32(m.k)+'</span></div>'+
      '<div class="r"><span class="t">'+LH.p1ir+'</span><span class="v">'+hx(m.c)+'</span></div>';
    var ch=ckd(m.k,m.c,st.idx);
    g('c4-child').innerHTML=
      '<div><span class="t">'+LH.p2idx+'</span><span class="v">'+st.idx+
      (st.idx>=0x80000000?' (hardened)':'')+'</span></div>'+
      '<div><span class="t">'+LH.p2data+'</span><span class="v">'+hx(ch.data)+'</span></div>'+
      '<div><span class="t">'+LH.p2il+'</span><span class="v">'+b32(ch.IL)+'</span></div>'+
      '<div class="l"><span class="t">'+LH.p2child+'</span><span class="v">'+b32(ch.k)+'</span></div>'+
      '<div class="r"><span class="t">'+LH.p2cc+'</span><span class="v">'+hx(ch.c)+'</span></div>';
    g('c4-idxv').textContent='i = '+st.idx;
    /* --- serangan --- */
    var c0=ckd(m.k,m.c,0);
    if(!st.leak){
      g('c4-atk').innerHTML=
        '<div><span class="t">'+LH.p4have+'</span><span class="v">xpub + chain code</span></div>'+
        '<div><span class="t">'+LH.p4orig+'</span><span class="v">'+b32(m.k).slice(0,24)+'\u2026</span></div>';
      var v=g('c4-verd'); v.className='hd-verd ok'; v.textContent=LH.p4safe;
    } else {
      var rec=mod(c0.k-c0.IL,Nn);
      g('c4-atk').innerHTML=
        '<div><span class="t">'+LH.p4have+'</span><span class="v">xpub + chain code</span></div>'+
        '<div class="bad"><span class="t">bocor: kunci anak i=0</span><span class="v">'+b32(c0.k)+'</span></div>'+
        '<div><span class="t">'+LH.p4step+' 1</span><span class="v">IL = HMAC(chain code, xpub \u2016 0) = '+b32(c0.IL).slice(0,24)+'\u2026</span></div>'+
        '<div class="bad"><span class="t">'+LH.p4step+' 2</span><span class="v">induk = anak - IL = '+b32(rec)+'</span></div>'+
        '<div><span class="t">'+LH.p4orig+'</span><span class="v">'+b32(m.k)+'</span></div>';
      var v=g('c4-verd');
      var sama=(rec===m.k);
      v.className='hd-verd '+(sama?'no':'ok');
      v.textContent=sama?LH.p4win:'\u2014';
    }
    g('c4-leak').textContent = st.leak ? LH.p4reset : LH.p4leak;
  }
  function init(){
    if(!g('c4-master')) return;
    g('c4-idx').addEventListener('input',function(e){
      var v=+e.target.value;
      st.idx = v<5 ? v : (0x80000000 + (v-5));
      render();
    });
    g('c4-leak').addEventListener('click',function(){ st.leak=!st.leak; render(); });
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

var LM={"p1n_": "Transaction count", "p1lvl": "Level", "p1dup": "duplicated", "p1root": "Merkle root", "p2a": "List A", "p2b": "List B", "p2ra": "Root A", "p2rb": "Root B", "p2same": "Identical roots, from different lists", "p2diff": "Different roots"};

/* ============================================================
   LAB C7 · SIMPUL GANJIL & CVE-2012-2459
   SHA-256 sungguhan, hash ganda seperti Bitcoin, byte dibalik seperti txid.
============================================================ */
(function(){
  var K=[],H0=[],pr=[],n2=2;
  function frac(x,p){ return Math.floor((Math.pow(x,1/p)%1)*4294967296)>>>0; }
  while(pr.length<64){ var ok=1; for(var i=2;i*i<=n2;i++) if(n2%i===0){ok=0;break;} if(ok) pr.push(n2); n2++; }
  for(var i=0;i<64;i++) K.push(frac(pr[i],3));
  for(var i=0;i<8;i++) H0.push(frac(pr[i],2));
  function rotr(x,k){ return ((x>>>k)|(x<<(32-k)))>>>0; }
  function sha256(bytes){
    var l=bytes.length,m=bytes.slice(); m.push(0x80);
    while(m.length%64!==56) m.push(0);
    var bl=l*8; for(var i=7;i>=0;i--) m.push(Math.floor(bl/Math.pow(2,i*8))&255);
    var H=H0.slice();
    for(var o=0;o<m.length;o+=64){
      var w=[];
      for(var t=0;t<16;t++) w.push(((m[o+t*4]<<24)|(m[o+t*4+1]<<16)|(m[o+t*4+2]<<8)|m[o+t*4+3])>>>0);
      for(var t=16;t<64;t++){
        var s0=(rotr(w[t-15],7)^rotr(w[t-15],18)^(w[t-15]>>>3))>>>0;
        var s1=(rotr(w[t-2],17)^rotr(w[t-2],19)^(w[t-2]>>>10))>>>0;
        w.push((w[t-16]+s0+w[t-7]+s1)>>>0);
      }
      var v=H.slice();
      for(var t=0;t<64;t++){
        var S1=(rotr(v[4],6)^rotr(v[4],11)^rotr(v[4],25))>>>0;
        var ch=((v[4]&v[5])^((~v[4])&v[6]))>>>0;
        var T1=(v[7]+S1+ch+K[t]+w[t])>>>0;
        var S0=(rotr(v[0],2)^rotr(v[0],13)^rotr(v[0],22))>>>0;
        var mj=((v[0]&v[1])^(v[0]&v[2])^(v[1]&v[2]))>>>0;
        v=[(T1+(S0+mj)>>>0)>>>0,v[0],v[1],v[2],(v[3]+T1)>>>0,v[4],v[5],v[6]];
      }
      for(var t=0;t<8;t++) H[t]=(H[t]+v[t])>>>0;
    }
    var out=[]; for(var t=0;t<8;t++) for(var b=3;b>=0;b--) out.push((H[t]>>>(b*8))&255);
    return out;
  }
  function d256(b){ return sha256(sha256(b)); }
  function hx(b){ var s=''; for(var i=0;i<b.length;i++) s+=('0'+b[i].toString(16)).slice(-2); return s; }
  function un(h){ var b=[]; for(var i=0;i<h.length;i+=2) b.push(parseInt(h.substr(i,2),16)); return b; }
  function rv(b){ return b.slice().reverse(); }
  function g(id){ return document.getElementById(id); }

  function txid(i){ var c=(10+i).toString(16); var s=''; for(var j=0;j<32;j++) s+=c; return s; }
  /* Root Merkle dengan aturan Bitcoin: level ganjil menggandakan simpul terakhir. */
  function merkle(ids){
    var lvl=ids.map(function(h){ return rv(un(h)); }), levels=[], dups=[];
    while(lvl.length>1){
      var dup=false;
      if(lvl.length%2){ lvl=lvl.concat([lvl[lvl.length-1]]); dup=true; }
      levels.push(lvl.map(function(h){return hx(rv(h));})); dups.push(dup);
      var nx=[];
      for(var i=0;i<lvl.length;i+=2) nx.push(d256(lvl[i].concat(lvl[i+1])));
      lvl=nx;
    }
    levels.push(lvl.map(function(h){return hx(rv(h));})); dups.push(false);
    return {levels:levels, dups:dups, root:hx(rv(lvl[0]))};
  }
  var st={n:3};
  function renderTree(){
    var ids=[]; for(var i=0;i<st.n;i++) ids.push(txid(i));
    var m=merkle(ids), h='';
    for(var i=0;i<m.levels.length;i++){
      var lv=m.levels[i], akhir=(i===m.levels.length-1);
      h+='<div class="mk-lvl"><span class="lb">'+(akhir?LM.p1root:LM.p1lvl+' '+i)+'</span>';
      for(var j=0;j<lv.length;j++){
        var dup = m.dups[i] && j===lv.length-1;
        h+='<span class="mk-n '+(akhir?'root':(dup?'dup':''))+'">'+lv[j].slice(0,10)+
           (dup?' \u21bb':'')+'</span>';
      }
      h+='</div>';
    }
    g('c7-tree').innerHTML=h;
    g('c7-nv').textContent=LM.p1n_+': '+st.n;
  }
  function renderCve(){
    var A=[txid(0),txid(1),txid(2)];
    var B=[txid(0),txid(1),txid(2),txid(2)];
    var ra=merkle(A).root, rb=merkle(B).root;
    g('c7-cve').innerHTML=
      '<div class="mk-box"><h6>'+LM.p2a+' (3)</h6><div class="list">'+
      A.map(function(x,i){return (i+1)+'. '+x.slice(0,12)+'\u2026';}).join('<br>')+
      '</div><div class="lb" style="font-size:8.5px;color:#7C6FD6">'+LM.p2ra+
      '</div><div class="rt">'+ra+'</div></div>'+
      '<div class="mk-box"><h6>'+LM.p2b+' (4)</h6><div class="list">'+
      B.map(function(x,i){return (i+1)+'. '+x.slice(0,12)+'\u2026'+(i===3?' \u21bb':'');}).join('<br>')+
      '</div><div class="lb" style="font-size:8.5px;color:#7C6FD6">'+LM.p2rb+
      '</div><div class="rt">'+rb+'</div></div>';
    var v=g('c7-verd');
    var sama=(ra===rb);
    v.className='mk-verd '+(sama?'no':'ok');
    v.textContent=sama?LM.p2same:LM.p2diff;
  }
  function init(){
    if(!g('c7-tree')) return;
    g('c7-n').addEventListener('input',function(e){ st.n=+e.target.value; renderTree(); });
    renderTree(); renderCve();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

