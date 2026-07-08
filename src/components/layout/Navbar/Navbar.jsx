import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('flowsync-theme') || '';
  });

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? '' : 'light'));
  };

  // Sync theme to document Element and LocalStorage
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('flowsync-theme', theme);
  }, [theme]);

  // Handle body scroll locking
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Escape key close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const isLight = theme === 'light';
  const themeLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  const mobileThemeText = isLight ? 'Light Mode' : 'Dark Mode';

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`nav-overlay ${isMobileOpen ? 'active' : ''}`}
        id="nav-overlay"
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      <header className="header reveal reveal-visible">
        <div className="container header-container">
          <div className="header-left">
            <button
              className={`nav-toggle ${isMobileOpen ? 'active' : ''}`}
              id="nav-toggle-btn"
              aria-label="Toggle navigation"
              aria-expanded={isMobileOpen ? 'true' : 'false'}
              aria-controls="nav-menu"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
            <Link to="/" className="logo" onClick={closeMobileMenu}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGrad)" />
                <path
                  d="M9 14L13 10L19 16"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 9V19"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <defs>
                  <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="logo-text">FlowSync</span>
            </Link>
          </div>

          <div className="desktop-nav">
            <ul className="nav-list">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><a href="#features" className="nav-link">Features</a></li>
              <li><a href="#pricing" className="nav-link">Pricing</a></li>
              <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
              <li><a href="#faq" className="nav-link">FAQ</a></li>
              <li><a href="#cta" className="nav-link">Contact</a></li>
            </ul>
          </div>

          <div className="nav-actions">
            <a href="#" className="btn btn-ghost nav-login" onClick={(e) => { e.preventDefault(); onLoginClick?.(); }}>Login</a>
            <Link to="/onboarding" className="btn btn-primary nav-cta">Start Free</Link>
            <button
              className="theme-toggle"
              id="theme-toggle-btn"
              aria-label={themeLabel}
              onClick={toggleTheme}
            >
              <svg
                className="theme-icon-sun"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg
                className="theme-icon-moon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <nav
        className={`nav-menu ${isMobileOpen ? 'active' : ''}`}
        id="nav-menu"
        aria-label="Main navigation"
      >
        <div className="nav-drawer-header">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGrad)" />
              <path
                d="M9 14L13 10L19 16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 9V19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">FlowSync</span>
          </Link>
          <button
            className="nav-close"
            id="nav-close-btn"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="nav-divider"></div>

        <ul className="nav-list">
          <li><Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link></li>
          <li><a href="#features" className="nav-link" onClick={closeMobileMenu}>Features</a></li>
          <li><a href="#pricing" className="nav-link" onClick={closeMobileMenu}>Pricing</a></li>
          <li><a href="#testimonials" className="nav-link" onClick={closeMobileMenu}>Testimonials</a></li>
          <li><a href="#faq" className="nav-link" onClick={closeMobileMenu}>FAQ</a></li>
          <li><a href="#cta" className="nav-link" onClick={closeMobileMenu}>Contact</a></li>
        </ul>

        <div className="nav-divider"></div>

        <button
          className="theme-toggle theme-toggle-mobile nav-theme-row"
          aria-label={themeLabel}
          onClick={toggleTheme}
        >
          <svg
            className="theme-icon-moon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
          <svg
            className="theme-icon-sun"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span className="theme-label">{mobileThemeText}</span>
        </button>

        <div className="nav-divider"></div>

        <div className="nav-drawer-actions">
          <a href="#" className="btn btn-ghost nav-drawer-login" onClick={(e) => { e.preventDefault(); closeMobileMenu(); onLoginClick?.(); }}>Login</a>
          <Link to="/onboarding" className="btn btn-primary nav-drawer-cta" onClick={closeMobileMenu}>
            Start Free Trial
          </Link>
        </div>
      </nav>
    </>
  );
};

export default React.memo(Navbar);
