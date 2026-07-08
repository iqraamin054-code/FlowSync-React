import { useState, useEffect, useRef, useCallback } from 'react';
import './Hero/Hero.css';
import { solutionFeatures } from '../../data/landingContent';

const dashboardStates = ['default', 'projects', 'automation', 'analytics'];

const navItems = [
  {
    label: 'Dashboard',
    state: 'default',
    activeIcon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    type: 'grid',
  },
  {
    label: 'Workflows',
    state: 'projects',
    activeIcon: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />,
    type: 'folder',
  },
  {
    label: 'Analytics',
    state: 'automation',
    activeIcon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    type: 'bars',
  },
  {
    label: 'Team',
    state: 'analytics',
    activeIcon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </>
    ),
    type: 'people',
  },
];

const statData = {
  default: [
    { label: 'Projects', value: 24, prefix: '', suffix: '', change: '+3', up: true, color: '#2563EB', icon: 'folder' },
    { label: 'Tasks', value: 156, prefix: '', suffix: '', change: '+12%', up: true, color: '#7C3AED', icon: 'check' },
    { label: 'Completed', value: 87, prefix: '', suffix: '', change: '+5%', up: true, color: '#10B981', icon: 'check-circle' },
  ],
  projects: [
    { label: 'Active Projects', value: 42, prefix: '', suffix: '', change: '+8', up: true, color: '#2563EB', icon: 'folder' },
    { label: 'Tasks', value: 318, prefix: '', suffix: '', change: '+23', up: true, color: '#7C3AED', icon: 'check' },
    { label: 'Deadlines', value: 12, prefix: '', suffix: '', change: '2', up: false, color: '#EF4444', icon: 'clock' },
  ],
  automation: [
    { label: 'Automations', value: 56, prefix: '', suffix: '', change: '+8', up: true, color: '#2563EB', icon: 'zap' },
    { label: 'Hours Saved', value: 420, prefix: '', suffix: '', change: '+42', up: true, color: '#7C3AED', icon: 'bar-chart' },
    { label: 'AI Actions', value: 1842, prefix: '', suffix: '', change: '+156', up: true, color: '#10B981', icon: 'activity' },
  ],
  analytics: [
    { label: 'Revenue', value: 84200, prefix: '$', suffix: 'K', change: '+18.7%', up: true, color: '#10B981', icon: 'dollar', display: '84.2' },
    { label: 'Growth', value: 26, prefix: '+', suffix: '%', change: '+5.2%', up: true, color: '#7C3AED', icon: 'zap' },
    { label: 'Conversion', value: 84, prefix: '', suffix: '%', change: '+1.2%', up: true, color: '#06B6D4', icon: 'activity' },
  ],
};

const panelData = {
  default: {
    chartTitle: 'Revenue Growth',
    chartBadge: '+23.4%',
    notifs: [
      { avatar: 'S', gradient: 'linear-gradient(135deg,#10B981,#059669)', text: 'Sarah completed Marketing Campaign', time: '2 min ago', dot: 'green' },
      { avatar: 'A', gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)', text: 'New Automation Created', time: '14 min ago', dot: 'blue' },
      { avatar: 'R', gradient: 'linear-gradient(135deg,#38BDF8,#0284C7)', text: 'Revenue increased by 18%', time: '1h ago', dot: 'cyan' },
    ],
  },
  projects: {
    chartTitle: 'Project Progress',
    chartBadge: '12 tasks',
    timeline: [
      { dot: 'blue', text: 'Sarah created Project Alpha', time: '12 min ago' },
      { dot: 'green', text: 'John completed UI Design', time: '45 min ago' },
      { dot: 'cyan', text: 'Sprint Planning started', time: '2h ago' },
      { dot: 'purple', text: 'David uploaded Wireframes', time: '4h ago', last: true },
    ],
  },
  automation: {
    chartTitle: 'Workflow Activity',
    chartBadge: 'Active',
    timeline: [
      { dot: 'purple', text: 'I can automate your workflow. Ready to help.', time: 'Just now' },
      { dot: 'purple', text: 'Suggest a timeline for Q3', time: '5 min ago' },
      { dot: 'purple', text: 'Draft ready based on current velocity.', time: '32 min ago', last: true },
    ],
  },
  analytics: {
    chartTitle: 'Revenue Analytics',
    chartBadge: '+18.7%',
    timeline: [
      { dot: 'cyan', text: 'Revenue report generated', time: '8 min ago' },
      { dot: 'cyan', text: 'Growth target exceeded by 5.2%', time: '1h ago' },
      { dot: 'cyan', text: 'Conversion rate optimized to 8.4%', time: '3h ago', last: true },
    ],
  },
};

const chartPaths = {
  default: 'M8 50 L30 44 L55 32 L80 22 L105 26 L130 18 L155 14 L180 20 L200 12',
  projects: null,
  automation: 'M8 48 L35 40 L60 20 L85 30 L110 14 L135 10 L160 6 L185 8 L200 4',
  analytics: 'M8 52 L35 46 L60 38 L85 28 L110 20 L135 12 L160 8 L185 6 L200 4',
};

function useAnimatedValue(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    fromRef.current = display;
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(fromRef.current + (target - fromRef.current) * eased);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return display;
}

function StatCard({ stat, animating }) {
  const numericVal = stat.display ? parseFloat(stat.display) : stat.value;
  const animatedVal = useAnimatedValue(animating ? numericVal : numericVal, 500);
  const displayValue = stat.display
    ? `$${(animatedVal / 1000).toFixed(1)}K`
    : `${stat.prefix}${animatedVal.toLocaleString('en-US')}${stat.suffix}`;

  const iconMap = {
    folder: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />,
    check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>,
    'check-circle': <polyline points="20 6 9 17 4 12" />,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    zap: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    'bar-chart': <><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>,
  };

  const sparkPaths = {
    'Projects': '0,14 8,12 16,15 24,8 32,10 40,5 48,7 56,3',
    'Tasks': '0,12 8,14 16,9 24,11 32,6 40,8 48,3 56,5',
    'Completed': '0,16 8,10 16,12 24,7 32,9 40,3 48,5 56,2',
    'Active Projects': '0,14 8,12 16,15 24,8 32,10 40,5 48,7 56,3',
    'Deadlines': '0,4 8,6 16,8 24,7 32,10 40,12 48,14 56,16',
    'Automations': '0,16 8,12 16,14 24,8 32,10 40,4 48,6 56,2',
    'Hours Saved': '0,14 8,16 16,10 24,12 32,6 40,8 48,3 56,5',
    'AI Actions': '0,12 8,10 16,14 24,6 32,8 40,3 48,5 56,1',
    'Revenue': '0,16 8,14 16,13 24,10 32,8 40,5 48,4 56,2',
    'Growth': '0,16 8,12 16,14 24,8 32,10 40,4 48,6 56,3',
    'Conversion': '0,14 8,16 16,11 24,13 32,7 40,9 48,4 56,6',
  };

  return (
    <div className="dash-stat-card">
      <div className="stat-icon-row">
        <svg className="stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {iconMap[stat.icon]}
        </svg>
        <span className={`stat-change ${stat.up ? 'stat-up' : 'stat-down'}`}>{stat.change}</span>
      </div>
      <span className="stat-label">{stat.label}</span>
      <span className="stat-value" style={{ transition: 'opacity 0.2s ease' }}>{displayValue}</span>
      <svg className="stat-sparkline" viewBox="0 0 60 18" width="60" height="18">
        <polyline points={sparkPaths[stat.label] || sparkPaths['Tasks']} fill="none" stroke={stat.color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function NotifItem({ notif }) {
  return (
    <div className="notif-item">
      <div className="notif-avatar" style={{ background: notif.gradient }}>{notif.avatar}</div>
      <div className="notif-body">
        <span className="notif-text">{notif.text}</span>
        <span className="notif-time">{notif.time}</span>
      </div>
      <span className={`notif-status-dot notif-dot-${notif.dot}`} />
    </div>
  );
}

function TimelineItem({ item }) {
  return (
    <div className="tl-item">
      <span className={`tl-dot tl-${item.dot}`} />
      {!item.last && <div className="tl-line" />}
      <div className="tl-content" style={item.last ? { paddingBottom: 0 } : undefined}>
        <span className="tl-text">{item.text}</span>
        <span className="tl-time">{item.time}</span>
      </div>
    </div>
  );
}

function ChartPanel({ state }) {
  const data = panelData[state];
  const path = chartPaths[state];

  return (
    <div className="panel-chart">
      <div className="panel-header">
        <span className="panel-title">{data.chartTitle}</span>
        <span className="panel-badge">{data.chartBadge}</span>
      </div>
      <div className="chart-wrapper">
        {path ? (
          <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chart" className="dash-chart-svg">
            <defs>
              <linearGradient id={`chartFill-${state}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <path d={`${path} L200 60 L8 60 Z`} fill={`url(#chartFill-${state})`} />
            <path className="chart-line" d={path} stroke="#2563EB" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle className="chart-end-dot" cx="200" cy={state === 'default' ? '12' : state === 'automation' ? '4' : '4'} r="3" fill="#2563EB" stroke="#1E293B" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Project chart">
            <defs>
              <linearGradient id="projChart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="8" y1="15" x2="192" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="8" y1="30" x2="192" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="8" y1="45" x2="192" y2="45" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="20" width="14" height="32" rx="3" fill="#2563EB" opacity="0.7" />
            <rect x="43" y="12" width="14" height="40" rx="3" fill="#2563EB" opacity="0.9" />
            <rect x="71" y="26" width="14" height="26" rx="3" fill="#2563EB" opacity="0.6" />
            <rect x="99" y="8" width="14" height="44" rx="3" fill="#2563EB" />
            <rect x="127" y="16" width="14" height="36" rx="3" fill="#2563EB" opacity="0.8" />
            <rect x="155" y="30" width="14" height="22" rx="3" fill="#2563EB" opacity="0.5" />
          </svg>
        )}
        <div className="chart-tooltip"><span className="chart-tooltip-val">$24.8K</span><span className="chart-tooltip-label">Revenue</span></div>
      </div>
    </div>
  );
}

function ActivityPanel({ state }) {
  const data = panelData[state];

  if (state === 'default') {
    return (
      <div className="panel-activity">
        <div className="panel-header"><span className="panel-title">Notifications</span></div>
        <div className="notif-list">
          {data.notifs.map((n, i) => <NotifItem key={i} notif={n} />)}
        </div>
      </div>
    );
  }

  const titles = { projects: 'Activity', automation: 'AI Assistant', analytics: 'Updates' };

  return (
    <div className="panel-activity">
      <div className="panel-header"><span className="panel-title">{titles[state]}</span></div>
      <div className="activity-timeline">
        {data.timeline.map((item, i) => <TimelineItem key={i} item={item} />)}
      </div>
    </div>
  );
}

export default function Solution({ activeState: propState = 'default' }) {
  const [activeState, setActiveState] = useState(propState);
  const [animating, setAnimating] = useState(false);
  const prevStateRef = useRef(propState);

  useEffect(() => {
    if (propState !== prevStateRef.current) {
      setAnimating(true);
      prevStateRef.current = propState;
      const t = setTimeout(() => setAnimating(false), 600);
      setActiveState(propState);
      return () => clearTimeout(t);
    }
    setActiveState(propState);
  }, [propState]);

  const stats = statData[activeState] || statData.default;

  return (
    <section className="solution-section reveal" id="solution">
      <div className="solution-glow solution-glow-1" />

      <div className="container">
        <div className="solution-layout reveal-stagger">
          <div className="solution-visual reveal">
            <div className="dash-wrapper solution-dash-wrapper" id="interactive-dash" data-dash-state={activeState}>
              <div className="dash-glow solution-dash-glow" />
              <div className="dash-preview solution-dash" role="img" aria-label="FlowSync unified dashboard">
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
                  <nav className="dash-nav" aria-label="Dashboard navigation">
                    {navItems.map((item) => (
                      <button
                        key={item.label}
                        className={`dash-nav-item${activeState === item.state ? ' active' : ''}`}
                        aria-label={item.label}
                        onClick={() => setActiveState(item.state)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {item.activeIcon}
                        </svg>
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="dash-main">
                  <div className="dash-header">
                    <div className="dash-header-left">
                      <div className="dash-workspace">
                        <svg className="dash-workspace-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        <span className="dash-workspace-name">FlowSync Hub</span>
                        <svg className="dash-chevron-down" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                      <div className="dash-search">
                        <svg className="dash-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input className="dash-search-input" type="text" placeholder="Overview" aria-label="Search" />
                      </div>
                    </div>

                    <div className="dash-header-right">
                      <button className="dash-notif-btn" aria-label="Notifications">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <span className="notif-dot" />
                        <span className="dash-notif-badge pulse">3</span>
                      </button>
                      <div className="dash-avatar-ring">
                        <div className="dash-avatar" aria-label="User avatar">
                          JD
                          <span className="dash-avatar-online" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dash-stats-container">
                    {dashboardStates.map((state) => (
                      <div key={state} className={`dash-stats dash-stats-${state}`} style={{ pointerEvents: state === activeState ? 'auto' : 'none' }}>
                        {statData[state].map((stat, i) => (
                          <StatCard key={`${state}-${stat.label}`} stat={stat} animating={state === activeState && animating} />
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="dash-panels-container">
                    {dashboardStates.map((state) => (
                      <div key={state} className={`dash-chart-panel dash-panel-${state}`} style={{ pointerEvents: state === activeState ? 'auto' : 'none' }}>
                        <ChartPanel state={state} />
                        <ActivityPanel state={state} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="dash-glow-bg" />
              <div className="solution-float-card">
                <div className="float-card-glow" />
                <div className="float-card-icon-efficiency">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <div className="float-card-info">
                  <span className="float-card-label">Efficiency</span>
                  <span className="float-card-value">+32%</span>
                  <span className="float-card-period">This Week</span>
                </div>
              </div>
            </div>
          </div>

          <div className="solution-content reveal">
            <span className="badge badge-primary section-badge">THE SOLUTION</span>
            <h2 className="section-title">One platform. Zero compromises.</h2>
            <p className="section-desc" style={{ maxWidth: '100%' }}>
              FlowSync replaces 6+ tools with a single, unified workspace. No more switching between apps. No more data scattered across spreadsheets. No more guessing what your team is working on.
            </p>
            <ul className="solution-features">
              {solutionFeatures.map((item) => (
                <li className="solution-feature-item" key={item.title}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span><strong>{item.title}</strong> {item.description}</span>
                </li>
              ))}
            </ul>
            <a href="#" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>See How It Works</a>
          </div>
        </div>
      </div>
    </section>
  );
}
