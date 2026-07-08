import { motion } from 'framer-motion';
import './Hero/Hero.css';

const dashStats = [
  { label: 'Revenue', value: '$54,200', change: '+12.5%', up: true },
  { label: 'Users', value: '12,430', change: '+8.2%', up: true },
  { label: 'Growth', value: '+18%', change: 'MoM', up: false },
];

const activityItems = [
  { dot: 'blue', text: 'New team member joined', time: '2m ago' },
  { dot: 'green', text: 'Project milestone completed', time: '1h ago' },
  { dot: 'cyan', text: 'Workflow automation triggered', time: '3h ago' },
];

const sidebarNavItems = [
  { label: 'Dashboard', active: true, type: 'rect' },
  { label: 'Projects', active: false, type: 'folder' },
  { label: 'Analytics', active: false, type: 'bars' },
  { label: 'Team', active: false, type: 'team' },
  { label: 'Settings', active: false, type: 'settings' },
];

const SidebarNavIcon = ({ type }) => {
  if (type === 'rect') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    );
  }
  if (type === 'folder') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    );
  }
  if (type === 'bars') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  if (type === 'team') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    );
  }
  return null;
};

const dashboardVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.75, ease: 'easeOut', delay: 0.3 },
  },
};

const floatVariants = {
  animate: (custom) => ({
    y: [-6, 6],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay: custom.delay,
    },
  }),
};

export default function ProductOverview({ prefersReduced }) {
  return (
    <div className="hero-visual" id="product-showcase">
      <motion.div
        className="dash-wrapper"
        initial={prefersReduced ? { opacity: 1 } : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={dashboardVariants}
        whileHover={prefersReduced ? {} : { scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="dash-glow" aria-hidden="true" />
        <div className="dash-preview" role="img" aria-label="FlowSync dashboard preview showing revenue, users, growth statistics, and activity feed">
          <div className="dash-sidebar">
            <div className="dash-logo-icon">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#dashLogo)" />
                <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="dashLogo" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <nav className="dash-nav" aria-label="Dashboard navigation">
              {sidebarNavItems.map(({ label, active, type }) => (
                <button key={label} className={`dash-nav-item${active ? ' active' : ''}`} aria-label={label} tabIndex={-1}>
                  <SidebarNavIcon type={type} />
                </button>
              ))}
            </nav>
          </div>

          <div className="dash-main">
            <div className="dash-header">
              <h2 className="dash-header-title">Dashboard</h2>
              <div className="dash-header-right">
                <button className="dash-notif-btn" aria-label="Notifications" tabIndex={-1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                  <span className="notif-dot" aria-hidden="true" />
                </button>
                <div className="dash-avatar" aria-label="User avatar">JD</div>
              </div>
            </div>

            <div className="dash-stats">
              {dashStats.map(({ label, value, change, up }) => (
                <div key={label} className={`dash-stat-card stat-${label.toLowerCase()}`}>
                  <span className="stat-label">{label}</span>
                  <span className="stat-value">{value}</span>
                  <span className={`stat-change${up ? ' stat-up' : ''}`}>{change}</span>
                </div>
              ))}
            </div>

            <div className="dash-bottom">
              <div className="dash-chart-panel">
                <div className="panel-header">
                  <span className="panel-title">Revenue Trend</span>
                  <span className="panel-badge">+23.4%</span>
                </div>
                <div className="chart-container">
                  <svg viewBox="0 0 240 70" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Line chart showing revenue growth trend">
                    <defs>
                      <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="10" y1="18" x2="230" y2="18" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="10" y1="35" x2="230" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="10" y1="52" x2="230" y2="52" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <path d="M10 62 L35 55 L60 50 L85 42 L110 30 L135 33 L160 20 L185 24 L210 15 L230 18" stroke="#7C3AED" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 62 L35 55 L60 50 L85 42 L110 30 L135 33 L160 20 L185 24 L210 15 L230 18 L230 70 L10 70 Z" fill="url(#chartArea)" />
                    <circle cx="210" cy="15" r="3.5" fill="#7C3AED" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="dash-activity-panel">
                <span className="panel-title">Recent Activity</span>
                <div className="activity-list">
                  {activityItems.map(({ dot, text, time }) => (
                    <div className="activity-item" key={text}>
                      <span className={`activity-dot activity-dot-${dot}`} aria-hidden="true" />
                      <div className="activity-content">
                        <span className="activity-text">{text}</span>
                        <span className="activity-time">{time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="float-card float-card-1"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 5, delay: 0 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
        >
          <div className="float-card-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="float-card-info">
            <span className="float-card-label">Revenue</span>
            <span className="float-card-value">$54.2K</span>
          </div>
        </motion.div>

        <motion.div
          className="float-card float-card-2"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 6, delay: 0.5 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
        >
          <div className="float-card-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
          </div>
          <div className="float-card-info">
            <span className="float-card-label">Active Users</span>
            <span className="float-card-value">12.4K</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
