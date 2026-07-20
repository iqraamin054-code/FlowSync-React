import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, setActiveEmail, getWorkspace, saveWorkspace } from '../../utils/workspaceStorage.js';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      setShowPassword(false);
      setTimeout(() => emailRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);
    const modal = modalRef.current;
    if (modal) modal.classList.remove('shake');

    const emailVal = email.trim();
    const passwordVal = password.trim();

    if (!emailVal || !passwordVal) {
      setError('Please fill in all fields.');
      if (modal) modal.classList.add('shake');
      return;
    }

    const account = getUser(emailVal);

    if (!account) {
      setError('No account found. Please start your free trial.');
      if (modal) modal.classList.add('shake');
      setLoading(true);
      setTimeout(() => setLoading(false), 600);
      return;
    }

    if (passwordVal !== account.password) {
      setError('Incorrect password.');
      if (modal) modal.classList.add('shake');
      setLoading(true);
      setTimeout(() => setLoading(false), 600);
      return;
    }

    setLoading(true);
    setActiveEmail(account.email);
    localStorage.setItem('isLoggedIn', 'true');
    // Start at the project-selection screen, not inside a previous project
    const ws = getWorkspace(account.email);
    if (ws.activeProjectId) {
      ws.activeProjectId = null;
      saveWorkspace(account.email, ws);
    }
    // Restore this user's saved theme and language preferences
    const savedTheme = ws.theme || 'dark';
    const savedLang = (ws.profile && ws.profile.language) || 'en';
    localStorage.setItem('flowsync-theme', savedTheme === 'light' ? 'light' : '');
    localStorage.setItem('flowsync-language', savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : '');
    setTimeout(() => {
      onClose();
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className={`login-overlay${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} onClick={onClose}>
      <div className="login-blob login-blob--1" aria-hidden="true" />
      <div className="login-blob login-blob--2" aria-hidden="true" />
      <div className="login-blob login-blob--3" aria-hidden="true" />
      <div className="login-modal" role="dialog" aria-modal="true" aria-label="Sign in to FlowSync" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="login-close" aria-label="Close login modal" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="login-logo">
          <svg width="56" height="56" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs><linearGradient id="loginLogoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs>
            <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#loginLogoGrad)"/>
            <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 9V19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to continue to your FlowSync workspace.</p>

        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input
                ref={emailRef}
                type="email"
                id="login-email"
                className="login-input"
                placeholder="Enter your email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                className="login-input"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="login-pw-toggle" aria-label="Toggle password visibility" tabIndex="-1" onClick={() => setShowPassword(!showPassword)}>
                <svg className="login-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: showPassword ? 'none' : '' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg className="login-eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: showPassword ? '' : 'none' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="login-checkbox">
              <input type="checkbox" defaultChecked />
              <span className="login-checkbox-mark"></span>
              <span>Remember me</span>
            </label>
            <a href="#" className="login-forgot">Forgot password?</a>
          </div>

          <div className={`login-error${error ? ' is-visible' : ''}`} role="alert">{error}</div>

          <button type="submit" className={`login-btn${loading ? ' loading' : ''}`}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <button type="button" className="login-btn login-btn--ghost" onClick={onClose}>Back to Home</button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <a href="#" className="login-trial" onClick={(e) => { e.preventDefault(); onClose(); navigate('/onboarding'); }}>Start Free Trial</a>
        </div>
      </div>
    </div>
  );
}
