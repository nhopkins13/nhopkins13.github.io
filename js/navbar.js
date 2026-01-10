document.addEventListener("DOMContentLoaded", () => {
  fetch('components/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
      initNavbarKeyboardNavigation();
    })
    .catch(err => console.error("Failed to load navbar:", err));
});

function initNavbarKeyboardNavigation() {
  const navContainer = document.getElementById('navbar');
  if (!navContainer) return;

  const anchors = Array.from(navContainer.querySelectorAll('a'));
  if (!anchors.length) return;

  anchors.forEach((a, i) => {
    a.setAttribute('data-nav-index', i);
    a.setAttribute('tabindex', '0');
  });

  const currentPath = window.location.pathname.split('/').pop();
  const savedIndex = parseInt(localStorage.getItem('navbar-focus-index'));
  const matchIndex = anchors.findIndex(a => {
    const href = a.getAttribute('href') || '';
    return href === currentPath || href === ('./' + currentPath) || href === ('/' + currentPath) || a.href.endsWith('/' + currentPath);
  });

  let currentIndex = Number.isInteger(savedIndex) && anchors[savedIndex] ? savedIndex : (matchIndex >= 0 ? matchIndex : 0);

  function isTypingInInput() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return el.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  document.addEventListener('keydown', (e) => {
    if (isTypingInInput()) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();

      // If focus is already inside navbar, start from that element
      if (document.activeElement && navContainer.contains(document.activeElement)) {
        const idx = parseInt(document.activeElement.getAttribute('data-nav-index'));
        if (!Number.isNaN(idx)) currentIndex = idx;
      }

      if (e.key === 'ArrowRight') currentIndex = (currentIndex + 1) % anchors.length;
      else if (e.key === 'ArrowLeft') currentIndex = (currentIndex - 1 + anchors.length) % anchors.length;
      else if (e.key === 'Home') currentIndex = 0;
      else if (e.key === 'End') currentIndex = anchors.length - 1;

      anchors[currentIndex].focus();
      localStorage.setItem('navbar-focus-index', currentIndex);
    }
  });

  // When a navbar link receives focus (e.g., clicked), persist its index
  anchors.forEach(a => {
    a.addEventListener('focus', () => {
      const idx = parseInt(a.getAttribute('data-nav-index'));
      if (!Number.isNaN(idx)) localStorage.setItem('navbar-focus-index', idx);
    });
  });
}