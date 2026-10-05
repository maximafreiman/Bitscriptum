/* ============================================================
   BOOT — anti-kedip.
   Saat ganti bahasa/tema, dokumen baru dimuat dari nol dan
   #page-welcome punya class "active" di HTML, jadi dia sempat
   tampil selama dokumen di-parse. Blok ini jalan SEBELUM <body>
   di-parse dan langsung menampilkan halaman tujuan lewat CSS.
============================================================ */
(function(){
  var st=null;
  try{if(window.parent&&window.parent!==window&&window.parent.__bsPending)st=window.parent.__bsPending;}catch(e){}
  if(!st){try{
    var r=sessionStorage.getItem('bitscriptum-lang-restore')||sessionStorage.getItem('bitscriptum-theme-restore');
    if(r)st=JSON.parse(r);
  }catch(e){}}
  if(!st||!st.page||st.page==='page-welcome')return;
  var ID=/^[A-Za-z][A-Za-z0-9_-]*$/;
  if(!ID.test(st.page))return;
  window.__bsBoot=st;
  var css='.page{display:none !important}#'+st.page+'{display:flex !important}';
  if(st.sec&&ID.test(st.sec)){css+='#'+st.page+' .p-section{display:none !important}#'+st.sec+'{display:block !important}';}
  if(st.apxSec&&ID.test(st.apxSec)){css+='.apx-section{display:none !important}#'+st.apxSec+'{display:block !important}';}
  var s=document.createElement('style');s.id='bs-boot';s.textContent=css;
  (document.head||document.documentElement).appendChild(s);
  /* pengaman: kalau restore gagal, jangan tinggalkan halaman kosong */
  setTimeout(function(){var e=document.getElementById('bs-boot');if(e&&e.parentNode)e.parentNode.removeChild(e);},5000);
})();
