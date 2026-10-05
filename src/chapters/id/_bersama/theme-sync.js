/* Theme sync: saat OS berganti light/dark di tengah sesi, semua simulasi
   dirender ulang dengan palet yang benar, tanpa kehilangan posisi halaman/section. */
(function(){
  var KEY='bitscriptum-theme-restore';
  try{
    var raw=sessionStorage.getItem(KEY);
    if(raw){
      sessionStorage.removeItem(KEY);
      var s=JSON.parse(raw);
      if(s&&s.page&&document.getElementById(s.page)&&typeof navigate==='function'){
        navigate(s.page);
        if(s.sb){var el=document.getElementById(s.sb);if(el)el.click();}
      }
    }
  }catch(e){}
  var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
  if(!mq)return;
  function onThemeChange(){
    try{
      var p=document.querySelector('.page.active');
      var sb=p?p.querySelector('.sidebar-item.active'):null;
      sessionStorage.setItem(KEY,JSON.stringify({page:p?p.id:null,sb:(sb&&sb.id)?sb.id:null}));
    }catch(e){}
    if(window.parent&&window.parent!==window){
      var __st=null;try{__st=window.__bsCaptureState?window.__bsCaptureState():null;}catch(e){}
      try{window.parent.postMessage({type:'bitscriptum-setlang',lang:'id',state:__st},'*');}catch(e){}
      setTimeout(function(){try{location.reload();}catch(e){}},600);
    }else{
      try{location.reload();}catch(e){}
    }
  }
  if(mq.addEventListener){mq.addEventListener('change',onThemeChange);}
  else if(mq.addListener){mq.addListener(onThemeChange);}
})();
