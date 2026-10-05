// ============================================================
// NAVIGATION
// ============================================================
function navigate(to) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(to).classList.add('active');
  window.scrollTo(0, 0);
  const pc = document.getElementById('prologue-content');
  if (pc) pc.scrollTop = 0;
  if (to === 'page-bab21') {
    showSectionInContentB21('section-21-1', 'sb-21-1');
  }
}

