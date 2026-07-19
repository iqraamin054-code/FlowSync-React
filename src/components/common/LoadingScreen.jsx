import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LOADER_DURATION = 620;
const FADE_DURATION = 200;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
    }, LOADER_DURATION);
    const completeTimer = setTimeout(() => onComplete?.(), LOADER_DURATION + FADE_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
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
