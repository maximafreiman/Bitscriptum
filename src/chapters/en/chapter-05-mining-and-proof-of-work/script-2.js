/* ============================================================
   CHAPTER 5 · 5.4 LAB (Interactive difficulty adjustment)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  function f1(x){return (Math.round(x*10)/10).toFixed(1);}
  function render(){
    const sl=g('b05-s54-hr'); if(!sl) return;
    const m=parseInt(sl.value,10)/10;              // hashrate multiplier
    const bt=10/m;                                  // minutes per block
    const days=(2016*bt)/1440;
    const clamped=Math.min(4,Math.max(0.25,m));     // 4x up/down limit
    const after=10*clamped/m;
    g('b05-s54-hr-val').textContent=f1(m)+'x';
    g('b05-s54-bt').textContent=f1(bt)+' min';
    g('b05-s54-dur').textContent=f1(days)+' days';
    const pct=(clamped-1)*100;
    g('b05-s54-adj').textContent=(Math.abs(pct)<0.5?'no change':(pct>0?'+':'')+Math.round(pct)+'%');
    g('b05-s54-after').textContent=f1(after)+' min';
    const cell=g('b05-s54-after-cell'), note=g('b05-s54-note');
    const hit=(m>4||m<0.25);
    cell.className='b05-lab-cell'+(hit?' warn':'');
    g('b05-s54-after').className='b05-lab-v '+(hit?'amber':'green');
    if(Math.abs(m-1)<0.05){
      note.className='b05-lab-note';
      note.innerHTML='Hashrate is steady, so there is nothing to adjust. Drag the slider to see what happens when miners arrive or leave.';
    } else if(!hit){
      note.className='b05-lab-note';
      note.innerHTML=(m>1
        ? 'More miners, so blocks are found faster than 10 minutes and this period finishes early. The network raises difficulty by <b>'+Math.round(pct)+'%</b> and block time returns to 10 minutes.'
        : 'Miners left, so blocks come slower and this period drags on. The network lowers difficulty by <b>'+Math.round(pct)+'%</b> and block time returns to 10 minutes.')
        +' Nobody decides this. Every node computes it independently and always arrives at the same answer.';
    } else {
      note.className='b05-lab-note warn';
      note.innerHTML='The change is too extreme. Bitcoin caps the adjustment at <b>4x</b> per period, so one correction is not enough: block time is still '+f1(after)+' minutes, not 10. It will take several more periods to fully recover. That cap exists so a single strange period cannot shake the network all at once.';
    }
  }
  const sl=g('b05-s54-hr');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

/* ============================================================
   CHAPTER 5 · 5.5 LAB (Interactive emission schedule)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  const BLOCKS=210000, TOTAL=21000000;
  function fmt(n,d){ return n.toLocaleString('en-US',{minimumFractionDigits:d||0,maximumFractionDigits:d||0}); }
  function supplyAt(era){
    let s=0;
    for(let n=0;n<=era;n++){ s += BLOCKS*(50/Math.pow(2,n)); }
    return s;
  }
  function render(){
    const sl=g('b05-s55-era'); if(!sl) return;
    const e=parseInt(sl.value,10);
    const reward=50/Math.pow(2,e);
    const gone=reward*1e8 < 1;                  // below one satoshi
    const supply=Math.min(supplyAt(e),TOTAL);
    const pct=supply/TOTAL*100;
    g('b05-s55-era-val').textContent='era '+e;
    g('b05-s55-year').textContent='~'+(e===0?2009:2008+e*4);
    g('b05-s55-reward').textContent = gone ? '0 BTC'
      : (reward>=0.001 ? String(parseFloat(reward.toFixed(8)))+' BTC'
                       : Math.round(reward*1e8)+' sats');
    g('b05-s55-supply').textContent=fmt(supply,0)+' BTC';
    g('b05-s55-pct').textContent=fmt(pct,2)+'%';
    g('b05-s55-bar').style.width=Math.min(100,pct)+'%';
    const note=g('b05-s55-note');
    if(e===0){
      note.className='b05-lab-note';
      note.innerHTML='The first era, 50 BTC per block. Notice that this single era alone already mints <b>a quarter</b> of every Bitcoin that will ever exist.';
    } else if(!gone){
      const left=TOTAL-supply;
      note.className='b05-lab-note';
      note.innerHTML='The reward has been halved '+e+' times. What remains to be mined across <b>all of the remaining time</b> is only about '+fmt(left,0)+' BTC. The curve keeps flattening, approaching 21 million without ever quite touching it.';
    } else {
      note.className='b05-lab-note warn';
      note.innerHTML='The reward has fallen below a single satoshi, so it is effectively <b>zero</b>. Around the year 2140, no new Bitcoin is minted at all. From that point on, the only income a miner has is <b>transaction fees</b>. This is why the questions about fees in Chapter 9 are not really about postage. They are about who pays for the security of the network.';
    }
  }
  const sl=g('b05-s55-era');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

