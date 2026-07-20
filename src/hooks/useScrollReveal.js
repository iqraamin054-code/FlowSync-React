import { useEffect } from 'react';

export default function useScrollReveal(ready) {
  useEffect(() => {
    if (!ready) return;

    let raf;
    let io;

    raf = requestAnimationFrame(() => {
      const revealElements = document.querySelectorAll('.reveal:not(.reveal-visible)');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach((el) => el.classList.add('reveal-visible'));
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: '0px 0px 140px 0px' }
      );

      revealElements.forEach((el) => {
        io.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, [ready]);
}
