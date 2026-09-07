// Preserve the city or index scroll position when returning along that path.
// Direct visits and JavaScript-free visits use the ordinary link destination.
const backLink = document.querySelector('[data-back]');
backLink?.addEventListener('click', event => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  try {
    const destination = new URL(backLink.href, location.href);
    const previous = new URL(document.referrer);
    if (previous.origin === destination.origin && previous.pathname === destination.pathname && history.length > 1) {
      event.preventDefault();
      history.back();
    }
  } catch { /* An empty referrer leaves the native link intact. */ }
});

try {
  const arrival = Number(sessionStorage.getItem('gedanken:arrival'));
  sessionStorage.removeItem('gedanken:arrival');
  if (arrival && Date.now() - arrival < 5000) document.documentElement.classList.add('arriving');
} catch { /* Storage is optional. */ }
