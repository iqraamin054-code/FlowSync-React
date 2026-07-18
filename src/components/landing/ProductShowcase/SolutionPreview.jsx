"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const solutionPreviewVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SolutionPreview() {
  const [dashState, setDashState] = useState('default');
  const [kpiValues, setKpiValues] = useState({
    default: { projects: 24, active: 42, tasks: 318, deadlines: 12, 
              automations: 56, hours: 420, aiActions: 1842, revenue: 84200, 
              growth: 26, conversion: 84 },
  });
  const [notifCount, setNotifCount] = useState(3);
  const kpiValuesRef = useRef(kpiValues);

  useEffect(() => {
    kpiValuesRef.current = kpiValues;
  }, [kpiValues]);

  // Header state management
  const [headerState, setHeaderState] = useState('default');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = {
      default: { projects: 24, active: 42, tasks: 87 },
      projects: { active: 42, tasks: 318, deadlines: 12 },
      automation: { automations: 56, hours: 420, aiActions: 1842 },
      analytics: { revenue: 84200, growth: 26, conversion: 84 },
    };
    
    const animateCounters = () => {
      // Capture initial values from ref at effect run time
      const initialValues = kpiValuesRef.current[headerState] || {};
      Object.keys(targets[headerState]).forEach((key) => {
        const target = targets[headerState][key];
        const start = initialValues[key] || 0;
        const diff = target - start;
        const duration = 1200;
        const step = Math.ceil(diff / (duration / 30));
        let current = start;
        
        const interval = setInterval(() => {
          current += step;
          if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
            current = target;
            setKpiValues(prev => ({
              ...prev,
              [headerState]: { ...prev[headerState], [key]: current }
            }));
            clearInterval(interval);
          } else {
            setKpiValues(prev => ({
              ...prev,
              [headerState]: { ...prev[headerState], [key]: Math.round(current) }
            }));
          }
        }, 30);
      });
    };

    if (headerState !== 'default') {
      animateCounters();
    }

    return () => {
      // Cleanup intervals
    };
  }, [headerState]);

  useEffect(() => {
    // Animation interval for header state changes
    const interval = setInterval(() => {
      if (dashState === 'projects') setHeaderState('projects');
      else if (dashState === 'automation') setHeaderState('automation');
      else if (dashState === 'analytics') setHeaderState('analytics');
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dashState]);

  const handleNavClick = (state) => {
    setDashState(state);
    setHeaderState(state);
  };

  const handleWorkspaceClick = () => {
    // Toggle workspace panel
  };

  const handleSearchFocus = () => {
    // Search functionality
  };

  return (
    <motion.div
      className="solution-dash-wrapper"
      data-dash-state={dashState}
      variants={solutionPreviewVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dash-glow-bg" />
      <div className="solution-dash">
        {/* Sidebar */}
        <div className="dash-sidebar">
          <div className="dash-logo-icon">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#solDashLogo)" />
              <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="solDashLogo" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <nav className="dash-nav" aria-label="Solution dashboard navigation">
            <button 
              className={`dash-nav-item dash-nav-projects ${headerState === 'projects' ? 'active' : ''}`} 
              onClick={() => handleNavClick('projects')}
              aria-label="Project overview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button 
              className={`dash-nav-item dash-nav-automation ${headerState === 'automation' ? 'active' : ''}`} 
              onClick={() => handleNavClick('automation')}
              aria-label="Automation workflows"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </button>
            <button 
              className={`dash-nav-item dash-nav-analytics ${headerState === 'analytics' ? 'active' : ''}`} 
              onClick={() => handleNavClick('analytics')}
              aria-label="Analytics"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </button>
            <button 
              className={`dash-nav-item ${headerState === 'default' ? 'active' : ''}`} 
              onClick={() => handleNavClick('default')}
              aria-label="Overview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M9 9h6v6H9z" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dash-main">
          {/* Header */}
          <div className="dash-header">
            <div className="dash-header-left">
              <div className="dash-workspace" onClick={handleWorkspaceClick} role="button" tabIndex={0}>
                <svg className="dash-workspace-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span className="dash-workspace-name">FlowSync Hub</span>
                <svg className="dash-chevron-down" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="dash-search" onClick={handleSearchFocus} role="button" tabIndex={0}>
                <svg className="dash-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  className="dash-search-input" 
                  type="text" 
                  placeholder="Search dashboard..." 
                  aria-label="Search dashboard"
                  readOnly
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="dash-header-right">
              <button 
                className="dash-notif-btn" 
                onClick={() => setNotifCount((prev) => (prev % 5) + 1)}
                aria-label="Notifications"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <span className="dash-notif-badge pulse">{notifCount}</span>
              </button>
              <div className="dash-avatar-ring">
                <div className="dash-avatar" aria-label="User avatar">
                  JD
                  <span className="dash-avatar-online"></span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="dash-stats-container">
            <div className="dash-stats dash-stats-default">
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                  <span className="stat-change stat-up">+3</span>
                </div>
                <span className="stat-label">Projects</span>
                <span className="stat-value" data-target="24">{kpiValues[headerState]?.projects || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,14 8,12 16,15 24,8 32,10 40,5 48,7 56,3" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <span className="stat-change stat-up">+12%</span>
                </div>
                <span className="stat-label">Tasks</span>
                <span className="stat-value" data-target="156">{kpiValues[headerState]?.tasks || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,12 8,14 16,9 24,11 32,6 40,8 48,3 56,5" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="stat-change stat-up">+5%</span>
                </div>
                <span className="stat-label">Completed</span>
                <span className="stat-value" data-target="87">{kpiValues[headerState]?.completed || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,16 8,10 16,12 24,7 32,9 40,3 48,5 56,2" fill="none" stroke="#10B981" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
            <div className="dash-stats dash-stats-projects">
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                  <span className="stat-change stat-up">+8</span>
                </div>
                <span className="stat-label">Active Projects</span>
                <span className="stat-value" data-target="42">{kpiValues[headerState]?.active || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,14 8,12 16,15 24,8 32,10 40,5 48,7 56,3" fill="none" stroke="#2563EB" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <span className="stat-change stat-up">+23</span>
                </div>
                <span className="stat-label">Tasks</span>
                <span className="stat-value" data-target="318">{kpiValues[headerState]?.tasks || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,12 8,14 16,9 24,11 32,6 40,8 48,3 56,5" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span class2="stat-change stat-down">2</span>
                </div>
                <span className="stat-label">Deadlines</span>
                <span className="stat-value" data-target="12">{kpiValues[headerState]?.deadlines || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,4 8,6 16,8 24,7 32,10 40,12 48,14 56,16" fill="none" stroke="#EF4444" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
            <div className="dash-stats dash-stats-automation">
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span className="stat-change stat-up">+8</span>
                </div>
                <span className="stat-label">Automations</span>
                <span className="stat-value" data-target="56">{kpiValues[headerState]?.automations || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,16 8,12 16,14 24,8 32,10 40,4 48,6 56,2" fill="none" stroke="#2563EB" stroke-width="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                  <span className="stat-change stat-up">+42</span>
                </div>
                <span className="stat-label">Hours Saved</span>
                <span className="stat-value" data-target="420">{kpiValues[headerState]?.hours || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,14 8,16 16,10 24,12 32,6 40,8 48,3 56,5" fill="none" stroke="#7C3AED" stroke-width="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 1010 10 4 4 0 01-5-5 4 4 0 01-5-5"/>
                    <path d="M8.5 8.5a5 5 0 007 7"/>
                  </svg>
                  <span className="stat-change stat-up">+156</span>
                </div>
                <span className="stat-label">AI Actions</span>
                <span className="stat-value" data-target="1842">{kpiValues[headerState]?.aiActions || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,12 8,10 16,14 24,6 32,8 40,3 48,5 56,1" fill="none" stroke="#10B981" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
            <div className="dash-stats dash-stats-analytics">
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                  <span className="stat-change stat-up">+18.7%</span>
                </div>
                <span className="stat-label">Revenue</span>
                <span className="stat-value" data-target="84200">${kpiValues[headerState]?.revenue || 0}</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,16 8,14 16,13 24,10 32,8 40,5 48,4 56,2" fill="none" stroke="#10B981" stroke-width="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span className="stat-change stat-up">+5.2%</span>
                </div>
                <span className="stat-label">Growth</span>
                <span className="stat-value" data-target="26">{kpiValues[headerState]?.growth || 0}%</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,16 8,12 16,14 24,8 32,10 40,4 48,6 56,3" fill="none" stroke="#7C3AED" stroke-width="1.5"/>
                </svg>
              </div>
              <div className="dash-stat-card">
                <div className="stat-icon-row">
                  <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  <span className="stat-change stat-up">+1.2%</span>
                </div>
                <span className="stat-label">Conversion</span>
                <span className="stat-value" data-target="84">{kpiValues[headerState]?.conversion || 0}%</span>
                <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
                  <polyline points="0,14 8,16 16,11 24,13 32,7 40,9 48,4 56,6" fill="none" stroke="#06B6D4" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Panels Container */}
          <div className="dash-panels-container">
            <div className="dash-chart-panel dash-panel-default">
              <div className="panel-chart">
                <div className="panel-header">
                  <span className="panel-title">Revenue Growth</span>
                  <span className="panel-badge">+23.4%</span>
                </div>
                <div className="chart-wrapper">
                  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Revenue chart" className="dash-chart-svg">
                    <defs>
                      <linearGradient id="defChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
                      </linearGradient>
                      <linearGradient id="defChartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.15"/>
                        <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="27" x2="192" y2="27" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="39" x2="192" y2="39" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="51" x2="192" y2="51" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2,2"/>
                    <path className="chart-fill" d="M8 50 L30 44 L55 32 L80 22 L105 26 L130 18 L155 14 L180 20 L200 12 L200 60 L8 60 Z" fill="url(#defChart)"/>
                    <path className="chart-fill-glow" d="M8 50 L30 44 L55 32 L80 22 L105 26 L130 18 L155 14 L180 20 L200 12 L200 60 L8 60 Z" fill="url(#defChartGlow)"/>
                    <path className="chart-line" d="M8 50 L30 44 L55 32 L80 22 L105 26 L130 18 L155 14 L180 20 L200 12" stroke="#2563EB" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle className="chart-end-dot" cx="200" cy="12" r="3" fill="#2563EB" stroke="#1E293B" stroke-width="1.5"/>
                    <text x="16" y="58" fill="rgba(255,255,255,0.25)" font-size="5" font-family="Inter,sans-serif">Jan</text>
                    <text x="56" y="58" fill="rgba(255,255,255,0.25)" font-size="5" font-family="Inter,sans-serif">Feb</text>
                    <text x="96" y="58" fill="rgba(255,255,255,0.25)" font-size="5" font-family="Inter,sans-serif">Mar</text>
                    <text x="134" y="58" fill="rgba(255,255,255,0.25)" font-size="5" font-family="Inter,sans-serif">Apr</text>
                    <text x="174" y="58" fill="rgba(255,255,255,0.25)" font-size="5" font-family="Inter,sans-serif">May</text>
                  </svg>
                  <div className="chart-tooltip">
                    <span className="chart-tooltip-val">$24.8K</span>
                    <span className="chart-tooltip-label">Revenue</span>
                  </div>
                </div>
              </div>
              <div className="panel-activity">
                <div className="panel-header">
                  <span className="panel-title">Notifications</span>
                </div>
                <div className="notif-list" data-activity="default">
                  <div className="notif-item">
                    <div className="notif-avatar" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>S</div>
                    <div className="notif-body">
                      <span className="notif-text">Sarah completed Marketing Campaign</span>
                      <span className="notif-time">2 min ago</span>
                    </div>
                    <span className="notif-status-dot notif-dot-green"></span>
                  </div>
                  <div className="notif-item">
                    <div className="notif-avatar" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>A</div>
                    <div className="notif-body">
                      <span className="notif-text">New Automation Created</span>
                      <span className="notif-time">14 min ago</span>
                    </div>
                    <span className="notif-status-dot notif-dot-blue"></span>
                  </div>
                  <div className="notif-item">
                    <div className="notif-avatar" style={{ background: 'linear-gradient(135deg,#38BDF8,#0284C7)' }}>R</div>
                    <div className="notif-body">
                      <span className="notif-text">Revenue increased by 18%</span>
                      <span className="notif-time">1h ago</span>
                    </div>
                    <span className="notif-status-dot notif-dot-cyan"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="dash-chart-panel dash-panel-projects">
              <div className="panel-chart">
                <div className="panel-header">
                  <span className="panel-title">Project Progress</span>
                  <span className="panel-badge">12 tasks</span>
                </div>
                <div className="chart-wrapper">
                  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Project progress chart">
                    <defs><linearGradient id="projChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.2"/>
                      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
                    </linearGradient></defs>
                    <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <rect x="15" y="20" width="14" height="32" rx="3" fill="#2563EB" opacity="0.7"/>
                    <rect x="43" y="12" width="14" height="40" rx="3" fill="#2563EB" opacity="0.9"/>
                    <rect x="71" y="26" width="14" height="26" rx="3" fill="#2563EB" opacity="0.6"/>
                    <rect x="99" y="8" width="14" height="44" rx="3" fill="#2563EB"/>
                    <rect x="127" y="16" width="14" height="36" rx="3" fill="#2563EB" opacity="0.8"/>
                    <rect x="155" y="30" width="14" height="22" rx="3" fill="#2563EB" opacity="0.5"/>
                    <text x="22" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">M</text>
                    <text x="50" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">T</text>
                    <text x="78" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">W</text>
                    <text x="106" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">T</text>
                    <text x="134" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">F</text>
                    <text x="162" y="58" fill="rgba(255,255,255,0.2)" font-size="5" font-family="Inter,sans-serif">S</text>
                  </svg>
                </div>
              </div>
              <div className="panel-activity">
                <div className="panel-header">
                  <span className="panel-title">Activity</span>
                </div>
                <div className="activity-timeline" data-activity="projects">
                  <div className="tl-item" style={{'--i': '0'}}><span className="tl-dot tl-blue"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">Sarah created Project Alpha</span><span className="tl-time">12 min ago</span></div></div>
                  <div className="tl-item" style={{'--i': '1'}}><span className="tl-dot tl-green"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">John completed UI Design</span><span className="tl-time">45 min ago</span></div></div>
                  <div className="tl-item" style={{'--i': '2'}}><span className="tl-dot tl-cyan"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">Sprint Planning started</span><span className="tl-time">2h ago</span></div></div>
                  <div className="tl-item" style={{'--i': '3'}}><span className="tl-dot tl-violet"></span><div className="tl-content" style={{'padding-bottom': '0'}}><span className="tl-text">David uploaded Wireframes</span><span className="tl-time">4h ago</span></div></div>
                </div>
              </div>
            </div>
            <div className="dash-chart-panel dash-panel-automation">
              <div className="panel-chart">
                <div className="panel-header">
                  <span className="panel-title">Workflow Activity</span>
                  <span className="panel-badge status-active">Active</span>
                </div>
                <div className="chart-wrapper">
                  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Workflow automation chart">
                    <defs><linearGradient id="autoChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.25"/>
                      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
                    </linearGradient></defs>
                    <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <path d="M8 48 L35 40 L60 20 L85 30 L110 14 L135 10 L160 6 L185 8 L200 4" stroke="#7C3AED" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 48 L35 40 L60 20 L85 30 L110 14 L135 10 L160 6 L185 8 L200 4 L200 60 L8 60 Z" fill="url(#autoChart)"/>
                    <circle cx="200" cy="4" r="3" fill="#7C3AED" stroke="#1E293B" stroke-width="1.5"/>
                  </svg>
                </div>
              </div>
              <div className="panel-activity">
                <div className="panel-header">
                  <span className="panel-title">AI Assistant</span>
                </div>
                <div className="activity-timeline" data-activity="automation">
                  <div className="tl-item" style={{'--i': '0'}}><span className="tl-dot tl-purple"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">I can automate your workflow. Ready to help.</span><span className="tl-time">Just now</span></div></div>
                  <div className="tl-item" style={{'--i': '1'}}><span className="tl-dot tl-purple"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">Suggest a timeline for Q3</span><span className="tl-time">5 min ago</span></div></div>
                  <div className="tl-item" style={{'--i': '2'}}><span className="tl-dot tl-purple"></span><div className="tl-content" style={{'padding-bottom': '0'}}><span className="tl-text">Draft ready based on current velocity.</span><span className="tl-time">32 min ago</span></div></div>
                </div>
              </div>
            </div>
            <div className="dash-chart-panel dash-panel-analytics">
              <div className="panel-chart">
                <div className="panel-header">
                  <span className="panel-title">Revenue Analytics</span>
                  <span className="panel-badge">+18.7%</span>
                </div>
                <div className="chart-wrapper">
                  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Business analytics chart">
                    <defs><linearGradient id="analChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.25"/>
                      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
                    </linearGradient></defs>
                    <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="2,2"/>
                    <path d="M8 52 L35 46 L60 38 L85 28 L110 20 L135 12 L160 8 L185 6 L200 4" stroke="#06B6D4" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 52 L35 46 L60 38 L85 28 L110 20 L135 12 L160 8 L185 6 L200 4 L200 60 L8 60 Z" fill="url(#analChart)"/>
                    <circle cx="200" cy="4" r="3" fill="#06B6D4" stroke="#1E293B" stroke-width="1.5"/>
                  </svg>
                </div>
              </div>
              <div className="panel-activity">
                <div className="panel-header">
                  <span className="panel-title">Updates</span>
                </div>
                <div className="activity-timeline" data-activity="analytics">
                  <div className="tl-item" style={{'--i': '0'}}><span className="tl-dot tl-cyan"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">Revenue report generated</span><span className="tl-time">8 min ago</span></div></div>
                  <div className="tl-item" style={{'--i': '1'}}><span className="tl-dot tl-cyan"></span><div className="tl-line"></div><div className="tl-content"><span className="tl-text">Growth target exceeded by 5.2%</span><span className="tl-time">1h ago</span></div></div>
                  <div className="tl-item" style={{'--i': '2'}}><span className="tl-dot tl-cyan"></span><div className="tl-content" style={{'padding-bottom': '0'}}><span className="tl-text">Conversion rate optimized to 8.4%</span><span className="tl-time">3h ago</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="solution-float-card">
          <div className="float-card-glow"></div>
          <div className="float-card-icon-efficiency">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div className="float-card-info">
            <span className="float-card-label">Efficiency</span>
            <span className="float-card-value">+32%</span>
            <span className="float-card-period">This Week</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}