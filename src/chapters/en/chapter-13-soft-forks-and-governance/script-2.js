/* ============================================================
   CHAPTER 13 · 13.3 LAB (Soft fork activation thresholds)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  function rows(p){
    return [
      {tag:'MASF',
       state: p>=95 ? 'yes' : 'no',
       verdict: p>=95 ? 'active' : 'fails',
       out: p>=95
         ? 'The <b>95%</b> threshold is met. The soft fork activates, and this is the smoothest path because nearly every miner is already ready.'
         : 'The <b>95%</b> threshold is not met. Activation does not happen, and simply waiting can drag on indefinitely.'},
      {tag:'Speedy Trial',
       state: p>=90 ? 'yes' : 'wait',
       verdict: p>=90 ? 'active' : 'expires',
       out: p>=90
         ? 'A lower threshold of <b>90%</b> and a window of only three months. It is met, so it activates without dragging on.'
         : 'The three-month window closes without reaching <b>90%</b>. The difference from MASF: the proposal expires cleanly instead of hanging around forever.'},
      {tag:'UASF',
       state: p>=51 ? 'yes' : (p>0 ? 'wait' : 'no'),
       verdict: p>=51 ? 'active' : (p>0 ? 'risky' : 'stalls'),
       out: p>=51
         ? 'Economic nodes reject blocks that do not signal. Since a majority of hashrate is already on board, their chain wins and the remaining miners have to follow.'
         : (p>0
            ? 'Economic nodes enforce the rule anyway, but a majority of hashrate has not joined. For a while there are two chains, and the winner depends on which one businesses and users actually use.'
            : 'Not a single miner joined. Economic nodes reject every block, and their chain stops growing. This is the worst-case risk of UASF.')},
      {tag:'URSF',
       state: p>=95 ? 'no' : 'yes',
       verdict: p>=95 ? 'loses' : 'holds',
       out: p>=95
         ? 'Miners are simply too dominant. Nodes that refuse end up on a minority chain, and their refusal has no effect.'
         : 'Economic nodes hold the line. As long as they reject blocks following the new rule, miners cannot impose it on their own.'},
    ];
  }
  function render(){
    const sl=g('b13-s133-sig'); if(!sl) return;
    const p=parseInt(sl.value,10);
    g('b13-s133-sig-val').textContent=p+'%';
    const wrap=g('b13-s133-rows'); wrap.innerHTML='';
    rows(p).forEach(r=>{
      const el=document.createElement('div');
      el.className='b13-lab-row '+r.state;
      el.innerHTML='<span class="b13-lab-tag">'+r.tag+'</span>'+
                   '<span class="b13-lab-out">'+r.out+'</span>'+
                   '<span class="b13-lab-verdict">'+r.verdict+'</span>';
      wrap.appendChild(el);
    });
    const n=g('b13-s133-lab-note');
    if(p>=95){
      n.innerHTML='At a number this high every mechanism agrees, so the choice of mechanism barely matters. <b>Their differences only show up once miners are split.</b> Drag downward and watch.';
    } else if(p>=90){
      n.innerHTML='Notice the gap between <b>90%</b> and <b>95%</b>. This is where Speedy Trial passes but classic MASF does not. That lower threshold plus a deadline is what let Taproot activate without repeating a multi-year war.';
    } else if(p>=51){
      n.innerHTML='This is the territory that produced the SegWit drama of 2017. Miners are not enough to activate via MASF, but users can force it via UASF. <b>The question shifts from technical to political:</b> who actually gets to decide?';
    } else if(p>0){
      n.innerHTML='Below half the hashrate, UASF turns from pressure into a gamble. The chain can split, and the winner is decided not by hashrate but by <b>which chain exchanges, businesses, and users actually adopt.</b>';
    } else {
      n.innerHTML='With no miners at all, UASF leaves economic nodes rejecting every block. It shows the limit of user power: they can set the rules, but <b>they cannot produce blocks themselves.</b>';
    }
  }
  const sl=g('b13-s133-sig');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

var LANG="en";
var LBL={"play": "Run", "pause": "Pause", "bytes": "bytes", "bits": "bits", "p2sel": "Word ", "p2from": "computed from", "p3step": "Round", "p3new": "newly computed", "p3shift": "shifted down", "verify": "Matches real SHA-256"};

