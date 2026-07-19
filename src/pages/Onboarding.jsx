import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWorkspaceUser, setWorkspaceTheme } from '../utils/workspaceStorage.js';

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Welcome', 'Company', 'Team', 'Preferences', 'Complete'];

const CHECK_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const ARROW_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const BACK_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const PLUS_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const CLOSE_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const FINISH_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
);
const SPINNER_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
);
const DOC_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
);

const ROLE_CARDS = [
  { value: 'startup', icon: '🚀', name: 'Startup', desc: 'Early-stage team moving fast' },
  { value: 'agency', icon: '🏢', name: 'Agency', desc: 'Client-focused creative team' },
  { value: 'enterprise', icon: '🏛️', name: 'Enterprise', desc: 'Large organisation, complex needs' },
  { value: 'freelancer', icon: '💼', name: 'Freelancer', desc: 'Solo professional, personal workspace' },
];

const INDUSTRIES = [
  { value: '', label: 'Select industry' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'finance', label: 'Finance & Fintech' },
  { value: 'healthcare', label: 'Healthcare & MedTech' },
  { value: 'education', label: 'Education & EdTech' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'consulting', label: 'Consulting & Services' },
  { value: 'manufacturing', label: 'Manufacturing & Logistics' },
  { value: 'other', label: 'Other' },
];

const TEAM_SIZES = [
  { value: '', label: 'Select size' },
  { value: '1', label: 'Just me' },
  { value: '2-10', label: '2 – 10' },
  { value: '11-50', label: '11 – 50' },
  { value: '51-200', label: '51 – 200' },
  { value: '201-1000', label: '201 – 1,000' },
  { value: '1000+', label: '1,000+' },
];

const COUNTRIES = [
  { value: '', label: 'Select country' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'sg', label: 'Singapore' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'other', label: 'Other' },
];

const ACCENT_COLORS = [
  { value: 'blue', color: '#2563EB', label: 'Blue' },
  { value: 'purple', color: '#7C3AED', label: 'Purple' },
  { value: 'green', color: '#10B981', label: 'Green' },
  { value: 'pink', color: '#EC4899', label: 'Pink' },
  { value: 'red', color: '#EF4444', label: 'Red' },
];

const LANGUAGES = [
  { value: 'en', label: 'English (US)' },
  { value: 'en-gb', label: 'English (UK)' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'ur', label: 'اردو' },
];

function updateAccentColorCSS(colorName) {
  const colorsMap = {
    blue: { primary: '#2563EB', hover: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.15)' },
    purple: { primary: '#7C3AED', hover: '#6D28D9', glow: 'rgba(124, 58, 237, 0.15)' },
    green: { primary: '#10B981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.15)' },
    pink: { primary: '#EC4899', hover: '#DB2777', glow: 'rgba(236, 72, 153, 0.15)' },
    red: { primary: '#EF4444', hover: '#DC2626', glow: 'rgba(239, 68, 68, 0.15)' },
  };
  const config = colorsMap[colorName] || colorsMap.blue;
  document.documentElement.style.setProperty('--color-primary', config.primary);
  document.documentElement.style.setProperty('--color-primary-hover', config.hover);
  document.documentElement.style.setProperty('--shadow-glow-primary', config.glow);
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [state, setState] = useState({
    role: '',
    fullName: '',
    workEmail: '',
    password: '',
    companyName: '',
    industry: '',
    teamSize: '',
    country: '',
    teamMembers: [],
    theme: 'dark',
    accentColor: 'blue',
    notifications: { email: true, push: false, activity: true },
    language: 'en',
    integrations: { slack: false, gdrive: false, github: false },
  });
  const [errors, setErrors] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteError, setInviteError] = useState('');
  const [loadingTasks, setLoadingTasks] = useState([0, 0, 0]);
  // Completion is handed off to the canonical /success route; the wizard's
  // former inline success card remains unreachable to avoid two success UIs.
  const [loadingDone] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const loadingRef = useRef(null);
  const stateRef = useRef(state);

  const percentage = (currentStep / TOTAL_STEPS) * 100;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const goToStep = useCallback((nextStep) => {
    if (nextStep < 1 || nextStep > TOTAL_STEPS) return;
    setDirection(nextStep > currentStep ? 'forward' : 'backward');
    setCurrentStep(nextStep);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 5) return;
    setLoadingTasks([0, 0, 0]);
    // Complete each setup task independently so the portal feels like the
    // workspace is being prepared, rather than all actions finishing at once.
    // Each task fires ~1.2–1.5 s apart so the setup screen feels like
    // real async work rather than an instant flash.
    const t1 = setTimeout(() => setLoadingTasks([2, 1, 0]), 1200);
    const t2 = setTimeout(() => setLoadingTasks([2, 2, 1]), 2700);
    const t3 = setTimeout(() => setLoadingTasks([2, 2, 2]), 4000);
    const t4 = setTimeout(() => {
      const setupState = stateRef.current;
      registerWorkspaceUser({
        email: setupState.workEmail,
        password: setupState.password,
        theme: setupState.theme,
        profile: {
          fullName: setupState.fullName,
          companyName: setupState.companyName,
          industry: setupState.industry,
          role: setupState.role,
          teamMembers: setupState.teamMembers,
          language: setupState.language,
        },
      });
      setWorkspaceTheme(setupState.theme, setupState.workEmail);
      localStorage.setItem('flowsync-team-members', setupState.teamMembers.length + 1);
      localStorage.setItem('flowsync-username', setupState.fullName);
      localStorage.setItem('flowsync-email', setupState.workEmail);
      localStorage.setItem('flowsync-password', setupState.password);
      localStorage.setItem('flowsync-company', setupState.companyName);
      localStorage.setItem('flowsync-industry', setupState.industry);
      localStorage.setItem('flowsync-role', setupState.role);
      localStorage.setItem('flowsync-accent', setupState.accentColor);
      localStorage.setItem('flowsync-language', setupState.language);
      localStorage.setItem('isLoggedIn', 'true');
    }, 4300);
    // The route-level Success page is the only success experience. Keep this
    // setup state as a short handoff so the wizard cannot render a competing
    // success card before navigating.
    const t5 = setTimeout(() => navigate('/success'), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [currentStep, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem('flowsync-theme');
    if (stored === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const nextIsLight = current !== 'light';
    document.documentElement.setAttribute('data-theme', nextIsLight ? 'light' : '');
    localStorage.setItem('flowsync-theme', nextIsLight ? 'light' : '');
    setState(s => ({ ...s, theme: nextIsLight ? 'light' : 'dark' }));
  };

  const validateStep2 = () => {
    const e = {};
    if (!state.fullName.trim()) e.fullName = 'Full name is required';
    if (!state.workEmail.trim()) e.workEmail = 'Work email is required';
    if (!state.password.trim()) e.password = 'Password is required';
    else if (state.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!state.companyName.trim()) e.companyName = 'Company name is required';
    if (!state.industry) e.industry = 'Industry is required';
    if (!state.teamSize) e.teamSize = 'Team size is required';
    if (!state.country) e.country = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addMember = () => {
    const email = inviteEmail.trim();
    if (!email) { setInviteError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteError('Enter a valid email address'); return; }
    if (state.teamMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) { setInviteError('Teammate already invited'); return; }
    setInviteError('');
    setState(s => ({ ...s, teamMembers: [...s.teamMembers, { email, role: inviteRole }] }));
    setInviteEmail('');
  };

  const removeMember = (index) => {
    setState(s => ({ ...s, teamMembers: s.teamMembers.filter((_, i) => i !== index) }));
  };

  const panelClass = `ob-panel ob-panel--active${direction === 'backward' ? ' ob-panel--slide-back' : ''}`;

  return (
    <>
      <div className="ob-bg" aria-hidden="true">
        <div className="ob-bg__orb ob-bg__orb--1"></div>
        <div className="ob-bg__orb ob-bg__orb--2"></div>
        <div className="ob-bg__orb ob-bg__orb--3"></div>
        <div className="ob-bg__grid"></div>
      </div>

      <main className="ob-shell" role="main" aria-label="Onboarding wizard">
        <header className="ob-header">
          <Link to="/" className="ob-logo" aria-label="FlowSync Home">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#obLogoGrad)" />
              <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 9V19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <defs>
                <linearGradient id="obLogoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span className="ob-logo__text">FlowSync</span>
          </Link>
          <div className="ob-header__right">
            <span className="ob-step-label" aria-live="polite">Step {currentStep} of {TOTAL_STEPS}</span>
            <button className="ob-theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
              <svg className="ob-theme-icon ob-theme-icon--sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg className="ob-theme-icon ob-theme-icon--moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </button>
          </div>
        </header>

        <nav className="ob-progress" aria-label="Onboarding progress">
          <div className="ob-progress__track">
            <div className="ob-progress__fill" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" style={{ width: `${percentage}%` }}></div>
          </div>
          <ol className="ob-steps">
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isDone = stepNum < currentStep;
              return (
                <li key={stepNum} className={`ob-step${isActive ? ' ob-step--active' : ''}${isDone ? ' ob-step--done' : ''}`} aria-current={isActive ? 'step' : undefined}>
                  <div className="ob-step__dot">
                    <span className="ob-step__num">{stepNum}</span>
                    <svg className="ob-step__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="ob-step__label">{label}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="ob-viewport" aria-live="polite">
          {currentStep === 1 && (
            <section className={panelClass} data-step="1" aria-labelledby="s1-title">
              <div className="ob-card glass-card">
                <div className="ob-card__head">
                  <div className="ob-badge">👋 Welcome</div>
                  <h1 className="ob-card__title" id="s1-title">How will you use FlowSync?</h1>
                  <p className="ob-card__sub">Choose the option that best describes you. We'll personalise your workspace accordingly.</p>
                </div>
                <div className="s1-grid" role="group" aria-label="Workspace type selection">
                  {ROLE_CARDS.map(card => (
                    <button key={card.value} className={`s1-card${state.role === card.value ? ' s1-card--selected' : ''}`} aria-pressed={state.role === card.value} onClick={() => setState(s => ({ ...s, role: card.value }))}>
                      <div className="s1-card__icon">{card.icon}</div>
                      <div className="s1-card__body">
                        <h3 className="s1-card__name">{card.name}</h3>
                        <p className="s1-card__desc">{card.desc}</p>
                      </div>
                      <div className="s1-card__check" aria-hidden="true">{CHECK_SVG}</div>
                    </button>
                  ))}
                </div>
                <div className="ob-card__foot">
                  <button className="ob-btn ob-btn--primary ripple" disabled={!state.role} aria-disabled={!state.role} onClick={() => goToStep(2)}>
                    Continue {ARROW_SVG}
                  </button>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className={panelClass} data-step="2" aria-labelledby="s2-title">
              <div className="ob-card glass-card">
                <div className="ob-card__head">
                  <div className="ob-badge">🏢 Company</div>
                  <h2 className="ob-card__title" id="s2-title">Tell us about your company</h2>
                  <p className="ob-card__sub">This helps us tailor your workspace to your organisation's scale.</p>
                </div>
                <form className="s2-form" noValidate onSubmit={e => e.preventDefault()}>
                  <div className="ob-field">
                    <input type="text" className={`ob-input${errors.fullName ? ' is-invalid' : ''}${state.fullName ? ' has-value' : ''}`} placeholder=" " autoComplete="name" value={state.fullName} onChange={e => { setState(s => ({ ...s, fullName: e.target.value })); if (errors.fullName) setErrors(er => { const n = { ...er }; delete n.fullName; return n; }); }} />
                    <label className="ob-label">Full Name <span className="ob-required" aria-hidden="true">*</span></label>
                    {errors.fullName && <span className="ob-error" role="alert">{errors.fullName}</span>}
                  </div>
                  <div className="ob-field">
                    <input type="email" className={`ob-input${errors.workEmail ? ' is-invalid' : ''}${state.workEmail ? ' has-value' : ''}`} placeholder=" " autoComplete="email" value={state.workEmail} onChange={e => { setState(s => ({ ...s, workEmail: e.target.value })); if (errors.workEmail) setErrors(er => { const n = { ...er }; delete n.workEmail; return n; }); }} />
                    <label className="ob-label">Work Email <span className="ob-required" aria-hidden="true">*</span></label>
                    {errors.workEmail && <span className="ob-error" role="alert">{errors.workEmail}</span>}
                  </div>
                  <div className="ob-field">
                    <input type="password" className={`ob-input${errors.password ? ' is-invalid' : ''}${state.password ? ' has-value' : ''}`} placeholder=" " autoComplete="new-password" value={state.password} onChange={e => { setState(s => ({ ...s, password: e.target.value })); if (errors.password) setErrors(er => { const n = { ...er }; delete n.password; return n; }); }} />
                    <label className="ob-label">Password <span className="ob-required" aria-hidden="true">*</span></label>
                    {errors.password && <span className="ob-error" role="alert">{errors.password}</span>}
                  </div>
                  <div className="ob-field">
                    <input type="text" className={`ob-input${errors.companyName ? ' is-invalid' : ''}${state.companyName ? ' has-value' : ''}`} placeholder=" " autoComplete="organization" value={state.companyName} onChange={e => { setState(s => ({ ...s, companyName: e.target.value })); if (errors.companyName) setErrors(er => { const n = { ...er }; delete n.companyName; return n; }); }} />
                    <label className="ob-label">Company Name <span className="ob-required" aria-hidden="true">*</span></label>
                    {errors.companyName && <span className="ob-error" role="alert">{errors.companyName}</span>}
                  </div>
                  <div className="ob-field">
                    <select className={`ob-input ob-select${errors.industry ? ' is-invalid' : ''}${state.industry ? ' has-value' : ''}`} value={state.industry} onChange={e => { setState(s => ({ ...s, industry: e.target.value })); if (errors.industry) setErrors(er => { const n = { ...er }; delete n.industry; return n; }); }}>
                      {INDUSTRIES.map(o => <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>)}
                    </select>
                    <label className="ob-label ob-label--select">Industry <span className="ob-required" aria-hidden="true">*</span></label>
                    {errors.industry && <span className="ob-error" role="alert">{errors.industry}</span>}
                  </div>
                  <div className="s2-row">
                    <div className="ob-field">
                      <select className={`ob-input ob-select${errors.teamSize ? ' is-invalid' : ''}${state.teamSize ? ' has-value' : ''}`} value={state.teamSize} onChange={e => { setState(s => ({ ...s, teamSize: e.target.value })); if (errors.teamSize) setErrors(er => { const n = { ...er }; delete n.teamSize; return n; }); }}>
                        {TEAM_SIZES.map(o => <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>)}
                      </select>
                      <label className="ob-label ob-label--select">Team Size <span className="ob-required" aria-hidden="true">*</span></label>
                      {errors.teamSize && <span className="ob-error" role="alert">{errors.teamSize}</span>}
                    </div>
                    <div className="ob-field">
                      <select className={`ob-input ob-select${errors.country ? ' is-invalid' : ''}${state.country ? ' has-value' : ''}`} value={state.country} onChange={e => { setState(s => ({ ...s, country: e.target.value })); if (errors.country) setErrors(er => { const n = { ...er }; delete n.country; return n; }); }}>
                        {COUNTRIES.map(o => <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>)}
                      </select>
                      <label className="ob-label ob-label--select">Country <span className="ob-required" aria-hidden="true">*</span></label>
                      {errors.country && <span className="ob-error" role="alert">{errors.country}</span>}
                    </div>
                  </div>
                </form>
                <div className="ob-card__foot">
                  <button className="ob-btn ob-btn--ghost ripple" onClick={() => goToStep(1)}>{BACK_SVG} Back</button>
                  <button className="ob-btn ob-btn--primary ripple" onClick={() => { if (validateStep2()) goToStep(3); }}>Continue {ARROW_SVG}</button>
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className={panelClass} data-step="3" aria-labelledby="s3-title">
              <div className="ob-card glass-card">
                <div className="ob-card__head">
                  <div className="ob-badge">👥 Team</div>
                  <h2 className="ob-card__title" id="s3-title">Invite your team</h2>
                  <p className="ob-card__sub">Add teammates now or skip and do it later from your workspace settings.</p>
                </div>
                <div className="s3-invite-row">
                  <div className="ob-field s3-email-field">
                    <input type="email" className={`ob-input${inviteError ? ' is-invalid' : ''}${inviteEmail ? ' has-value' : ''}`} placeholder=" " autoComplete="off" value={inviteEmail} onChange={e => { setInviteEmail(e.target.value); if (inviteError) setInviteError(''); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMember(); } }} />
                    <label className="ob-label">Email address</label>
                    {inviteError && <span className="ob-error" role="alert">{inviteError}</span>}
                  </div>
                  <div className="ob-field s3-role-field">
                    <select className="ob-input ob-select has-value" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                      <option value="guest">Guest</option>
                    </select>
                    <label className="ob-label ob-label--select">Role</label>
                  </div>
                  <button className="ob-btn ob-btn--add ripple" aria-label="Add team member" onClick={addMember}>{PLUS_SVG}</button>
                </div>
                <div className="s3-members" aria-label="Invited members" aria-live="polite">
                  {state.teamMembers.map((member, index) => (
                    <div key={index} className="s3-chip">
                      <span className="s3-chip__email">{member.email}</span>
                      <span className="s3-chip__role">{member.role}</span>
                      <button className="s3-chip__remove" aria-label={`Remove ${member.email}`} onClick={() => removeMember(index)}>{CLOSE_SVG}</button>
                    </div>
                  ))}
                </div>
                {state.teamMembers.length === 0 && <p className="s3-hint">No members added yet — you can always invite later.</p>}
                <div className="ob-card__foot">
                  <button className="ob-btn ob-btn--ghost ripple" onClick={() => goToStep(2)}>{BACK_SVG} Back</button>
                  <div className="s3-foot-right">
                    <button className="ob-btn ob-btn--text" onClick={() => { setState(s => ({ ...s, teamMembers: [] })); goToStep(4); }}>Skip for now</button>
                    <button className="ob-btn ob-btn--primary ripple" onClick={() => goToStep(4)}>Continue {ARROW_SVG}</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className={panelClass} data-step="4" aria-labelledby="s4-title">
              <div className="ob-card glass-card">
                <div className="ob-card__head">
                  <div className="ob-badge">⚙️ Preferences</div>
                  <h2 className="ob-card__title" id="s4-title">Customise your workspace</h2>
                  <p className="ob-card__sub">Fine-tune how FlowSync looks and behaves for your team.</p>
                </div>
                <div className="s4-sections">
                  <div className="s4-section">
                    <h3 className="s4-section__title">Workspace Theme</h3>
                    <div className="s4-theme-group" role="radiogroup" aria-label="Choose theme">
                      <label className={`s4-theme-card${state.theme === 'light' ? ' s4-theme-card--active' : ''}`}>
                        <input type="radio" name="ws-theme" value="light" className="visually-hidden" checked={state.theme === 'light'} onChange={() => { setState(s => ({ ...s, theme: 'light' })); document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('flowsync-theme', 'light'); }} />
                        <div className="s4-theme-preview s4-theme-preview--light" aria-hidden="true">
                          <div className="s4-theme-preview__bar"></div>
                          <div className="s4-theme-preview__rows"><div className="s4-theme-preview__row"></div><div className="s4-theme-preview__row"></div></div>
                        </div>
                        <span className="s4-theme-name">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                          Light
                        </span>
                      </label>
                      <label className={`s4-theme-card${state.theme === 'dark' ? ' s4-theme-card--active' : ''}`}>
                        <input type="radio" name="ws-theme" value="dark" className="visually-hidden" checked={state.theme === 'dark'} onChange={() => { setState(s => ({ ...s, theme: 'dark' })); document.documentElement.setAttribute('data-theme', ''); localStorage.setItem('flowsync-theme', ''); }} />
                        <div className="s4-theme-preview s4-theme-preview--dark" aria-hidden="true">
                          <div className="s4-theme-preview__bar"></div>
                          <div className="s4-theme-preview__rows"><div className="s4-theme-preview__row"></div><div className="s4-theme-preview__row"></div></div>
                        </div>
                        <span className="s4-theme-name">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                          Dark
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="s4-section">
                    <h3 className="s4-section__title">Accent Color</h3>
                    <div className="s4-colors" role="radiogroup" aria-label="Choose accent color">
                      {ACCENT_COLORS.map(c => (
                        <label key={c.value} className={`s4-color-swatch${state.accentColor === c.value ? ' s4-color-swatch--active' : ''}`} style={{ '--swatch': c.color }} title={c.label}>
                          <input type="radio" name="accent" value={c.value} className="visually-hidden" checked={state.accentColor === c.value} onChange={() => { setState(s => ({ ...s, accentColor: c.value })); updateAccentColorCSS(c.value); }} />
                          <svg className="s4-color-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          <span className="visually-hidden">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="s4-two-col">
                    <div className="s4-section">
                      <h3 className="s4-section__title">Notifications</h3>
                      <div className="s4-toggles">
                        {[
                          { key: 'email', label: 'Email Digests', desc: 'Weekly summary emails' },
                          { key: 'push', label: 'Push Alerts', desc: 'Real-time browser notifications' },
                          { key: 'activity', label: 'Activity Feed', desc: 'In-app activity stream' },
                        ].map(t => (
                          <div key={t.key} className="s4-toggle-row">
                            <div className="s4-toggle-info">
                              <span className="s4-toggle-label">{t.label}</span>
                              <span className="s4-toggle-desc">{t.desc}</span>
                            </div>
                            <label className="ob-toggle" aria-label={t.label}>
                              <input type="checkbox" checked={state.notifications[t.key]} onChange={e => setState(s => ({ ...s, notifications: { ...s.notifications, [t.key]: e.target.checked } }))} />
                              <span className="ob-toggle__track"><span className="ob-toggle__thumb"></span></span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="s4-section">
                      <h3 className="s4-section__title">Language</h3>
                      <div className="ob-field">
                        <select className="ob-input ob-select has-value" value={state.language} onChange={e => setState(s => ({ ...s, language: e.target.value }))}>
                          {LANGUAGES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <label className="ob-label ob-label--select">Display Language</label>
                      </div>
                    </div>
                  </div>

                  <div className="s4-section">
                    <h3 className="s4-section__title">Connect Integrations</h3>
                    <div className="s4-integrations">
                      {[
                        { key: 'slack', name: 'Slack', desc: 'Team messaging', bg: '#4A154B', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.527 2.527 0 012.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 012.521 2.521 2.527 2.527 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.527 2.527 0 01-2.522 2.521h-2.522V8.834zm-1.268 0a2.527 2.527 0 01-2.523 2.521 2.526 2.526 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/></svg> },
                        { key: 'gdrive', name: 'Google Drive', desc: 'Cloud file storage', bg: '#1A73E8', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M6.5 2L1 11.5l4 7L9.5 11 6.5 2zM17.5 2L14.5 11l4.5 7.5L23 11 17.5 2zM12 11L7.5 18.5h9L12 11z"/></svg> },
                        { key: 'github', name: 'GitHub', desc: 'Code repository', bg: '#24292F', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
                      ].map(int => (
                        <label key={int.key} className="s4-integration" htmlFor={`int-${int.key}`}>
                          <input type="checkbox" id={`int-${int.key}`} checked={state.integrations[int.key]} onChange={e => setState(s => ({ ...s, integrations: { ...s.integrations, [int.key]: e.target.checked } }))} />
                          <div className="s4-integration__icon" style={{ background: int.bg }}>{int.icon}</div>
                          <div className="s4-integration__body">
                            <span className="s4-integration__name">{int.name}</span>
                            <span className="s4-integration__desc">{int.desc}</span>
                          </div>
                          <div className="s4-integration__check" aria-hidden="true">{CHECK_SVG}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ob-card__foot">
                  <button className="ob-btn ob-btn--ghost ripple" onClick={() => goToStep(3)}>{BACK_SVG} Back</button>
                  <button className="ob-btn ob-btn--primary ripple" onClick={() => goToStep(5)}>Finish Setup {FINISH_SVG}</button>
                </div>
              </div>
            </section>
          )}

          {currentStep === 5 && (
            <section className={panelClass} data-step="5" aria-labelledby="s5-title">
              <div className="ob-card ob-card--success glass-card">
                {!loadingDone ? (
                  <div className="s5-loading" aria-live="polite">
                    <div className="s5-loader">
                      <div className="s5-loader__ring"></div>
                      <div className="s5-loader__ring s5-loader__ring--2"></div>
                    </div>
                    <h2 className="s5-loading__title">Setting up your workspace…</h2>
                    <div className="s5-tasks">
                      <div className={`s5-task${loadingTasks[0] === 1 ? '' : loadingTasks[0] === 2 ? ' s5-task--done' : ''}`}>
                        <div className={`s5-task__icon${loadingTasks[0] === 0 && loadingTasks[1] === 0 ? ' s5-task__icon--spin' : ''}`}>
                          {loadingTasks[0] === 2 ? CHECK_SVG : SPINNER_SVG}
                        </div>
                        <span>Preparing workspace…</span>
                      </div>
                      <div className={`s5-task${loadingTasks[1] === 0 ? ' s5-task--pending' : loadingTasks[1] === 2 ? ' s5-task--done' : ''}`}>
                        <div className={`s5-task__icon${loadingTasks[1] === 0 && loadingTasks[2] === 0 ? '' : ''}`}>
                          {loadingTasks[1] === 2 ? CHECK_SVG : loadingTasks[1] === 1 ? <span className="s5-task__icon--spin">{SPINNER_SVG}</span> : DOC_SVG}
                        </div>
                        <span>Creating dashboard…</span>
                      </div>
                      <div className={`s5-task${loadingTasks[2] === 0 ? ' s5-task--pending' : loadingTasks[2] === 2 ? ' s5-task--done' : ''}`}>
                        <div className={`s5-task__icon${loadingTasks[2] === 0 ? '' : ''}`}>
                          {loadingTasks[2] === 2 ? CHECK_SVG : loadingTasks[2] === 1 ? <span className="s5-task__icon--spin">{SPINNER_SVG}</span> : SPINNER_SVG}
                        </div>
                        <span>Syncing data…</span>
                      </div>
                    </div>
                    <div className="s5-progress-bar">
                      <div className="s5-progress-fill" style={{ width: `${(loadingTasks.filter(t => t === 2).length / 3) * 100}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="s5-success">
                    <div className="s5-success__icon-wrap">
                      <div className="s5-success__ring"></div>
                      <div className="s5-success__icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    </div>
                    <h2 className="s5-success__title">You're all set! 🎉</h2>
                    <p className="s5-success__sub">Your workspace is ready. Let's start building something amazing together.</p>
                    <div className="s5-success__stats">
                      <div className="s5-stat">
                        <span className="s5-stat__val">{state.teamMembers.length + 1}</span>
                        <span className="s5-stat__label">Members</span>
                      </div>
                      <div className="s5-stat">
                        <span className="s5-stat__val">1</span>
                        <span className="s5-stat__label">Projects</span>
                      </div>
                      <div className="s5-stat">
                        <span className="s5-stat__val">3</span>
                        <span className="s5-stat__label">Integrations</span>
                      </div>
                    </div>
                    <div className="s5-success__actions">
                      <Link to="/dashboard" className="ob-btn ob-btn--primary ob-btn--lg">Go to Dashboard {ARROW_SVG}</Link>
                      <button className="ob-btn ob-btn--ghost" onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
