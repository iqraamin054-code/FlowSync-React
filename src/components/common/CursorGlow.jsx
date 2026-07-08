import { useEffect } from 'react';

export default function CursorGlow() {
  useEffect(() => {
    if (matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let raf = null;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return <div id="cursor-glow" className="cursor-glow" aria-hidden="true" />;
}
