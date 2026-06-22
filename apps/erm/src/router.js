import { useEffect, useState } from 'react';

/* Tiny hash router — no dependency, works under GitHub Pages at /erm/.
   #/                -> home/overview
   #/lesson/<id>     -> a lesson */

export function parseHash(hash) {
  const h = (hash || '').replace(/^#/, '');
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'lesson' && parts[1]) return { view: 'lesson', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'glossary') return { view: 'glossary' };
  return { view: 'home' };
}

export function navigate(to) {
  window.location.hash = to;
  window.scrollTo({ top: 0 });
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
