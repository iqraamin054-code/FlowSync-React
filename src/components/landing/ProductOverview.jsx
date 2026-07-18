import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import './Hero/Hero.css';

const dashStats = [
  { label: 'Revenue', raw: 54200, prefix: '$', suffix: '', change: '+12.5%', up: true },
  { label: 'Users', raw: 12430, prefix: '', suffix: '', change: '+8.2%', up: true },
  { label: 'Growth', raw: 18, prefix: '+', suffix: '%', change: 'MoM', up: false },
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

function useCountUp(target, duration = 1.6, delay = 0.8) {
  const reduced = useReducedMotion();
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    const rounded = Math.round(v);
    return rounded >= 1000 ? rounded.toLocaleString('en-US') : String(rounded);
  });
  const [displayVal, setDisplayVal] = useState(reduced ? String(target >= 1000 ? target.toLocaleString('en-US') : target) : '0');

  useEffect(() => {
    if (reduced) return;
    const controls = animate(motionVal, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = display.on('change', setDisplayVal);
    return () => { controls.stop(); unsub(); };
  }, [target, duration, delay, reduced, motionVal, display]);

  return displayVal;
}

const floatVariants = {
  animate: (custom) => ({
    y: [custom.yStart || -6, custom.yEnd || 6],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay: custom.delay,
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3,
      staggerChildren: 0.06,
    },
  },
};

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.1 },
  }),
};

const activityVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 + i * 0.12 },
  }),
};

const chartPanelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.0 },
  },
};

const activityPanelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.15 },
  },
};

const widgetEntrance = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const CHART_PATH = 'M10 55 L35 48 L60 42 L85 34 L110 22 L135 26 L160 14 L185 18 L210 9 L230 12';

export default function ProductOverview({ prefersReduced }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const chartLineRef = useRef(null);
  const [pathLen, setPathLen] = useState(320);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    if (chartLineRef.current) {
      setPathLen(chartLineRef.current.getTotalLength());
    }
    setChartVisible(true);

  }, []);

  const handleMouseMove = useCallback((e) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -5;
    setTilt({ x, y });
  }, [prefersReduced]);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const revenue = useCountUp(54200, 1.8, 0.7);
  const users = useCountUp(12430, 1.6, 0.9);
  const growth = useCountUp(18, 1.4, 1.1);

  const kpiValues = [
    { formatted: `$${revenue}` },
    { formatted: users },
    { formatted: `+${growth}%` },
  ];

  return (
    <div className="hero-visual" id="product-showcase">
      <motion.div
        className="dash-wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
      >
        <div className="dash-glow" aria-hidden="true" />
        <div className="dash-glow-ring" aria-hidden="true" />
        <div className="dash-preview" role="img" aria-label="FlowSync dashboard preview showing revenue, users, growth statistics, and activity feed">
          <motion.div className="dash-sidebar" variants={sidebarVariants}>
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
                  {active && <span className="nav-active-glow" aria-hidden="true" />}
                </button>
              ))}
            </nav>
          </motion.div>

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
              {dashStats.map(({ label, change, up }, i) => (
                <motion.div
                  key={label}
                  className="dash-stat-card"
                  custom={i}
                  variants={statCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="stat-label">{label}</span>
                  <span className="stat-value">{kpiValues[i].formatted}</span>
                  <span className={`stat-change${up ? ' stat-up' : ''}`}>{change}</span>
                </motion.div>
              ))}
            </div>

            <div className="dash-bottom">
              <motion.div className="dash-chart-panel" variants={chartPanelVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="panel-header">
                  <span className="panel-title">Revenue Trend</span>
                  <span className="panel-badge">+23.4%</span>
                </div>
                <div className="chart-container">
                  <svg viewBox="0 0 240 65" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Line chart showing revenue growth trend">
                    <defs>
                      <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="10" y1="15" x2="230" y2="15" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="10" y1="30" x2="230" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="10" y1="45" x2="230" y2="45" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    {prefersReduced ? (
                      <>
                        <path d={CHART_PATH} stroke="url(#chartStroke)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                          <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#60A5FA" />
                          </linearGradient>
                        </defs>
                        <path d={`${CHART_PATH} L230 65 L10 65 Z`} fill="url(#chartArea)" />
                      </>
                    ) : (
                      <>
                        <defs>
                          <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#60A5FA" />
                          </linearGradient>
                        </defs>
                        <motion.path
                          ref={chartLineRef}
                          d={CHART_PATH}
                          stroke="url(#chartStroke)"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ strokeDasharray: pathLen, strokeDashoffset: pathLen }}
                          animate={chartVisible ? { strokeDashoffset: 0 } : {}}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <motion.path
                          d={`${CHART_PATH} L230 65 L10 65 Z`}
                          fill="url(#chartArea)"
                          initial={{ opacity: 0 }}
                          animate={chartVisible ? { opacity: 1 } : {}}
                          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
                        />
                      </>
                    )}
                    <motion.circle
                      cx="210" cy="9" r="3.5"
                      fill="#7C3AED"
                      stroke="#1E293B"
                      strokeWidth="1.5"
                      initial={prefersReduced ? {} : { scale: 0, opacity: 0 }}
                      animate={chartVisible ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 2, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </svg>
                </div>
              </motion.div>

              <motion.div className="dash-activity-panel" variants={activityPanelVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="panel-title">Recent Activity</span>
                <div className="activity-list">
                  {activityItems.map(({ dot, text, time }, i) => (
                    <motion.div
                      className="activity-item"
                      key={text}
                      custom={i}
                      variants={activityVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <span className={`activity-dot activity-dot-${dot}`} aria-hidden="true" />
                      <div className="activity-content">
                        <span className="activity-text">{text}</span>
                        <span className="activity-time">{time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Floating Widget 1: Revenue — Top Right ── */}
        <motion.div
          className="float-card float-card-1"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 5, delay: 0, yStart: -7, yEnd: 7 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="float-card-icon float-card-icon-violet"
            custom={1.6}
            variants={widgetEntrance}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </motion.div>
          <div className="float-card-info">
            <span className="float-card-label">Revenue</span>
            <span className="float-card-value">$54.2K</span>
          </div>
        </motion.div>

        {/* ── Floating Widget 2: Active Users — Bottom Left ── */}
        <motion.div
          className="float-card float-card-2"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 6, delay: 0.5, yStart: -5, yEnd: 5 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="float-card-icon float-card-icon-pink"
            custom={1.8}
            variants={widgetEntrance}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </motion.div>
          <div className="float-card-info">
            <span className="float-card-label">Active Users</span>
            <span className="float-card-value">+18K</span>
          </div>
        </motion.div>

        {/* ── Floating Widget 3: Tasks Completed — Upper Left ── */}
        <motion.div
          className="float-card float-card-3"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 5.5, delay: 1.0, yStart: -4, yEnd: 4 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="float-card-icon float-card-icon-green"
            custom={2.0}
            variants={widgetEntrance}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
          <div className="float-card-info">
            <span className="float-card-label">Tasks Done</span>
            <span className="float-card-value">1,248</span>
          </div>
        </motion.div>

        {/* ── Floating Widget 4: Productivity — Bottom Right ── */}
        <motion.div
          className="float-card float-card-4"
          aria-hidden="true"
          custom={prefersReduced ? {} : { duration: 4.8, delay: 1.5, yStart: -6, yEnd: 6 }}
          animate={prefersReduced ? {} : 'animate'}
          variants={floatVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="float-card-icon float-card-icon-amber"
            custom={2.2}
            variants={widgetEntrance}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </motion.div>
          <div className="float-card-info">
            <span className="float-card-label">Productivity</span>
            <span className="float-card-value">+240%</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
