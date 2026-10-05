/* ============================================================
   LANGUAGE SWITCHER — tersedia di SEMUA halaman.
   Saat bahasa diganti, posisi halaman + section + scroll
   dipertahankan (tidak balik ke welcome page).
============================================================ */
(function(){
  var CUR="en";
  var LANGS=[['id','ID'],['en','EN']];
  var RKEY='bitscriptum-lang-restore';
  var restored=false;

  /* Cari elemen yang BENAR-BENAR bisa di-scroll. Di layout ini biasanya
     window yang scroll (.page pakai min-height:100vh), bukan .prologue-content. */
  function scroller(pg){
    if(!pg)return null;
    var cand=[pg.querySelector('.prologue-content'),pg.querySelector('.cl-content'),pg.querySelector('.apx-body')];
    for(var i=0;i<cand.length;i++){
      var el=cand[i];
      if(el&&el.scrollHeight>el.clientHeight+2)return el;
    }
    return null;
  }
  function winTop(){
    return window.pageYOffset||document.documentElement.scrollTop||0;
  }
  /* Konten dirender bertahap (chart, canvas), jadi tinggi halaman belum final.
     Coba beberapa kali sampai posisi scroll benar-benar nempel. */
  function restoreScroll(pg,top,useWin){
    var n=0;
    (function attempt(){
      n++;
      var sc=useWin?null:scroller(pg);
      if(sc){sc.scrollTop=top;}else{window.scrollTo(0,top);}
      var cur=sc?sc.scrollTop:winTop();
      if(Math.abs(cur-top)>4&&n<10){setTimeout(attempt,90);}
    })();
  }

  function captureState(){
    var p=document.querySelector('.page.active');
    var sb=p?p.querySelector('.sidebar-item.active'):null;
    var apx=document.querySelector('.apx-tab-btn.apx-act');
    var sec=p?p.querySelector('.p-section.active'):null;
    var apxSec=document.querySelector('.apx-section.apx-active');
    var sc=scroller(p);
    return {
      page:p?p.id:null,
      sb:(sb&&sb.id)?sb.id:null,
      apx:(apx&&apx.id)?apx.id:null,
      sec:(sec&&sec.id)?sec.id:null,
      apxSec:(apxSec&&apxSec.id)?apxSec.id:null,
      top:sc?sc.scrollTop:winTop(),
      win:!sc
    };
  }

  function applyState(s){
    if(restored||!s||!s.page)return;
    var pg=document.getElementById(s.page);
    if(!pg||typeof navigate!=='function')return;
    restored=true;
    navigate(s.page);
    if(s.sb){var el=document.getElementById(s.sb);if(el)el.click();}
    if(s.apx){var t=document.getElementById(s.apx);if(t)t.click();}
    if(s.top>0){setTimeout(function(){restoreScroll(pg,s.top,s.win!==false);},80);}
    dropBoot();
  }

  function dropBoot(){
    var e=document.getElementById('bs-boot');
    if(e&&e.parentNode)e.parentNode.removeChild(e);
  }

  function requestLang(code){
    var st=captureState();
    try{sessionStorage.setItem(RKEY,JSON.stringify(st));}catch(e){}
    if(window.parent&&window.parent!==window){
      try{window.parent.postMessage({type:'bitscriptum-setlang',lang:code,state:st},'*');}catch(e){}
    }
  }

  function buildSwitch(cls){
    var box=document.createElement('div');
    if(cls)box.className=cls;
    for(var i=0;i<LANGS.length;i++){(function(code,label){
      var b=document.createElement('button');
      b.type='button';
      b.textContent=label;
      b.title=(code==='id'?'Bahasa Indonesia':'English');
      if(code===CUR){b.className='bs-active';b.setAttribute('aria-current','true');}
      else{b.addEventListener('click',function(){requestLang(code);});}
      box.appendChild(b);
    })(LANGS[i][0],LANGS[i][1]);}
    return box;
  }

  function mountWelcome(){
    var w=document.getElementById('page-welcome');
    if(!w||document.getElementById('bs-lang-toggle'))return;
    var box=buildSwitch(null);
    box.id='bs-lang-toggle';
    var dl=w.querySelector('.divider-line');
    if(dl&&dl.parentNode){dl.parentNode.insertBefore(box,dl.nextSibling);}
    else{w.appendChild(box);}
  }

  function mountTopbars(){
    var bars=document.querySelectorAll('.topbar');
    for(var i=0;i<bars.length;i++){
      var tb=bars[i];
      if(tb.querySelector('.bs-lang-switch'))continue;
      var right=document.createElement('div');
      right.className='bs-tb-right';
      var blk=tb.querySelector('.topbar-block');
      if(blk){tb.insertBefore(right,blk);right.appendChild(blk);}
      else{tb.appendChild(right);}
      right.appendChild(buildSwitch('bs-lang-switch'));
    }
    var apx=document.querySelectorAll('.apx-topbar');
    for(var j=0;j<apx.length;j++){
      var ab=apx[j];
      if(ab.querySelector('.bs-lang-switch'))continue;
      var r2=document.createElement('div');
      r2.className='bs-tb-right';
      r2.appendChild(buildSwitch('bs-lang-switch'));
      ab.appendChild(r2);
    }
  }

  window.addEventListener('message',function(e){
    if(e.source!==window.parent)return;          /* abaikan pengirim asing */
    var d=e.data;
    if(d&&d.type==='bitscriptum-restore'&&d.state){applyState(d.state);}
  });

  function init(){
    mountWelcome();
    mountTopbars();
    var st=null;
    try{
      var raw=sessionStorage.getItem(RKEY);
      if(raw){sessionStorage.removeItem(RKEY);st=JSON.parse(raw);}
    }catch(e){}
    if(!st&&window.__bsBoot)st=window.__bsBoot;   /* dibaca langsung, tanpa nunggu postMessage */
    if(st)applyState(st);
    if(window.parent&&window.parent!==window){
      try{window.parent.postMessage({type:'bitscriptum-ready'},'*');}catch(e){}
    }
  }

  /* dipakai blok theme-sync di bawah supaya posisi halaman ikut terbawa */
  window.__bsCaptureState=captureState;

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
})();
