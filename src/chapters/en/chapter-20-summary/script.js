// ============================================================
function showSectionInContentB20(sectionId, sbId) {
  document.querySelectorAll('#page-bab20 .p-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('#page-bab20 .sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById(sbId).classList.add('active');
  const content = document.getElementById('bab20-content');
  if (content) content.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ============================================================
// PAGE 23 · BAB 20 · TOPBAR
// ============================================================
document.getElementById('back-home-b20').addEventListener('click',     () => navigate('page-welcome'));
document.getElementById('back-chapters-b20').addEventListener('click', () => navigate('page-chapters'));

// ============================================================
// PAGE 23 · BAB 20 · CHAPTER LIST
// ============================================================
document.getElementById('ch-bab20').addEventListener('click', () => navigate('page-bab20'));

// ============================================================
// PAGE 23 · BAB 20 · SIDEBAR EVENTS (20.1 - 20.6)
// ============================================================
document.getElementById('sb-20-1').addEventListener('click', () => showSectionInContentB20('section-20-1', 'sb-20-1'));
document.getElementById('sb-20-2').addEventListener('click', () => showSectionInContentB20('section-20-2', 'sb-20-2'));
document.getElementById('sb-20-3').addEventListener('click', () => showSectionInContentB20('section-20-3', 'sb-20-3'));
document.getElementById('sb-20-4').addEventListener('click', () => showSectionInContentB20('section-20-4', 'sb-20-4'));
document.getElementById('sb-20-5').addEventListener('click', () => showSectionInContentB20('section-20-5', 'sb-20-5'));
document.getElementById('sb-20-6').addEventListener('click', () => showSectionInContentB20('section-20-6', 'sb-20-6'));

// ============================================================
// PAGE 23 · BAB 20 · NAV BUTTONS
// ============================================================
document.querySelectorAll('#page-bab20 .p-nav-btn.p-nav-active').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const sb     = btn.getAttribute('data-sb');
    if (target && sb) showSectionInContentB20(target, sb);
  });
});
