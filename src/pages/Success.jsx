import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
  const [members, setMembers] = useState(1);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const storedTheme = localStorage.getItem('flowsync-theme');
    document.documentElement.setAttribute('data-theme', storedTheme === 'light' ? 'light' : '');

    const storedMembers = parseInt(localStorage.getItem('flowsync-team-members'), 10);
    setMembers(Number.isNaN(storedMembers) || storedMembers < 1 ? 1 : storedMembers);

    const storedName = localStorage.getItem('flowsync-username') || '';
    if (storedName) {
      setFirstName(storedName.trim().split(/\s+/)[0]);
    }

    const accentMap = {
      blue: { primary: '#2563EB', hover: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.15)' },
      purple: { primary: '#7C3AED', hover: '#6D28D9', glow: 'rgba(124, 58, 237, 0.15)' },
      green: { primary: '#10B981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.15)' },
      pink: { primary: '#EC4899', hover: '#DB2777', glow: 'rgba(236, 72, 153, 0.15)' },
      red: { primary: '#EF4444', hover: '#DC2626', glow: 'rgba(239, 68, 68, 0.15)' },
    };
    const accentKey = localStorage.getItem('flowsync-accent') || 'blue';
    const accent = accentMap[accentKey] || accentMap.blue;
    document.documentElement.style.setProperty('--color-primary', accent.primary);
    document.documentElement.style.setProperty('--color-primary-hover', accent.hover);
    document.documentElement.style.setProperty('--shadow-glow-primary', accent.glow);

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const colors = ['#2563EB', '#7C3AED', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];
    const confettiList = [];
    for (let i = 0; i < 180; i++) {
      confettiList.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
      });
    }

    let animTime = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      confettiList.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.wobble) * 1.5;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        if (p.y < canvas.height) active = true;
      });
      animTime++;
      if (active && animTime < 300) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <>
      <div className="ob-bg" aria-hidden="true">
        <div className="ob-bg__orb ob-bg__orb--1"></div>
        <div className="ob-bg__orb ob-bg__orb--2"></div>
        <div className="ob-bg__orb ob-bg__orb--3"></div>
        <div className="ob-bg__grid"></div>
      </div>

      <div className="success-shell">
        <div className="success-panel">
          <div className="success-card glass-card">
            <div className="s5-success" aria-live="polite">
              <div className="s5-success__icon-wrap">
                <div className="s5-success__ring"></div>
                <div className="s5-success__icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <h1 className="s5-success__title">
                {firstName ? `Welcome, ${firstName}!` : 'Welcome to FlowSync!'} <span className="s5-success__emoji" aria-hidden="true">🎉</span>
              </h1>
              <p className="s5-success__sub">Your workspace has been successfully created. Everything is ready — let's build something great.</p>
              <div className="s5-success__stats">
                <div className="s5-stat">
                  <span className="s5-stat__val">{members}</span>
                  <span className="s5-stat__label">Members</span>
                </div>
                <div className="s5-stat">
                  <span className="s5-stat__val">1</span>
                  <span className="s5-stat__label">Workspace</span>
                </div>
                <div className="s5-stat">
                  <span className="s5-stat__val">∞</span>
                  <span className="s5-stat__label">Possibilities</span>
                </div>
              </div>
              <div className="s5-success__actions">
                <Link to="/dashboard" className="ob-btn ob-btn--primary ob-btn--lg ripple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Open Dashboard
                </Link>
                <Link to="/" className="ob-btn ob-btn--ghost ripple">Back to Landing Page</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas id="confetti-canvas" aria-hidden="true"></canvas>
    </>
  );
}
