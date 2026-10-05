// ============================================================
// PAGE APPENDIX
// ============================================================
(function() {
  function g(id){return document.getElementById(id);}
  var TAB_IDS  = ['apx-t1','apx-t2','apx-t3'];
  var SECT_IDS = ['apx-s1','apx-s2','apx-s3'];
  function showApxSection(sectId) {
    TAB_IDS.forEach(function(tid) {
      var btn = g(tid); if (!btn) return;
      btn.className = 'apx-tab-btn' + (btn.getAttribute('data-section')===sectId?' apx-act':'');
    });
    SECT_IDS.forEach(function(sid) {
      var el = g(sid); if (!el) return;
      el.className = 'apx-section' + (sid===sectId?' apx-active':'');
    });
    window.scrollTo(0,0);
  }
  TAB_IDS.forEach(function(tid) {
    var btn = g(tid); if (!btn) return;
    btn.addEventListener('click',function(){showApxSection(btn.getAttribute('data-section'));});
  });
  ['apx-next1','apx-next2','apx-prev2','apx-prev3'].forEach(function(id) {
    var btn = g(id); if (!btn) return;
    btn.addEventListener('click',function(){showApxSection(btn.getAttribute('data-section'));});
  });
  var backBtn = g('apx-back-btn');
  if (backBtn) backBtn.addEventListener('click',function(){navigate('page-chapters');});
  var logo = g('apx-back-chapters');
  if (logo) logo.addEventListener('click',function(){navigate('page-chapters');});
  document.querySelectorAll('.apx-chapter-btn').forEach(function(btn) {
    btn.addEventListener('click',function() {
      var sectId = btn.getAttribute('data-section');
      navigate('page-appendix');
      setTimeout(function(){showApxSection(sectId);},50);
    });
  });
})();

