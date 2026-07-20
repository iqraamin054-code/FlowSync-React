import { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

const LOADER_DURATION = 1500;
const FADE_DURATION = 300;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const rafRef = useRef();

  useEffect(() => {
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min((elapsed / LOADER_DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFadeOut(true);
        setTimeout(() => onComplete?.(), FADE_DURATION);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <div className={`ls-root ${fadeOut ? 'ls-fade-out' : ''}`} aria-label="Loading FlowSync">
      <div className="ls-content">
        <div className="ls-logo-pulse">
          <svg width="48" height="48" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="ls-logo">
            <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#lsLogoGrad)" />
            <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 9V19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <defs>
              <linearGradient id="lsLogoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ls-pulse-ring" />
          <div className="ls-pulse-ring ls-pulse-ring--delayed" />
        </div>

        <div className="ls-text">
          <span className="ls-brand">FlowSync</span>
          <span className="ls-status">Loading Workspace…</span>
        </div>

        <div className="ls-progress-track">
          <div className="ls-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
