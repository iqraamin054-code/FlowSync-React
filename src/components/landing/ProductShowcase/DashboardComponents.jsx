import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Sparkline ── */
export function Sparkline({ data, width = 60, height = 20, color = '#10B981' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - 2 - ((v - min) / range) * (height - 6),
  }));

  const linePath = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpX = prev.x + (p.x - prev.x) / 2;
    return `C${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
  }).join(' ');

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const gradId = `spk-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="dsh-sparkline" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Animated Number ── */
export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (Math.abs(diff) < 0.01) { setDisplay(value); return; }
    const duration = 600;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ── Dashboard Header ── */
export function DashboardHeader({ notifCount }) {
  return (
    <header className="dsh-header">
      <div className="dsh-header-left">
        <div className="dsh-logo" aria-hidden="true" />
        <span className="dsh-logo-text">FlowSync</span>
      </div>
      <div className="dsh-header-center">
        <div className="dsh-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" className="dsh-search-input" placeholder="Search anything..." readOnly aria-label="Search" />
          <kbd className="dsh-search-kbd">⌘K</kbd>
        </div>
      </div>
      <div className="dsh-header-right">
        <div className="dsh-live-badge">
          <span className="dsh-live-dot" aria-hidden="true" />
          Live
        </div>
        <button className="dsh-icon-btn" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          {notifCount > 0 && <span className="dsh-notif-badge">{notifCount}</span>}
        </button>
        <div className="dsh-avatar" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} aria-label="User menu">
          <span>JD</span>
          <span className="dsh-avatar-status" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

/* ── KPI Card ── */
export function KPICard({ card, index, value }) {
  return (
    <motion.div
      className="dsh-kpi"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
    >
      <div className="dsh-kpi-icon" style={{ background: card.gradient }} aria-hidden="true">
        {card.id === 'revenue' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
        {card.id === 'users' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>}
        {card.id === 'workflows' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
        {card.id === 'conversion' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
      </div>
      <div className="dsh-kpi-body">
        <span className="dsh-kpi-label">{card.label}</span>
        <span className="dsh-kpi-value">
          <AnimatedNumber
            value={value}
            prefix={card.prefix}
            suffix={card.suffix}
            decimals={card.id === 'conversion' ? 1 : 0}
          />
        </span>
        <span className={`dsh-kpi-change ${card.positive ? 'pos' : 'neg'}`}>
          {card.positive ? '↑' : '↓'} {card.change}%
        </span>
      </div>
    </motion.div>
  );
}

/* ── Revenue Chart ── */
export function RevenueChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const width = 500;
  const height = 180;
  const pad = { top: 20, right: 20, bottom: 30, left: 0 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxRev = Math.max(...data.map((d) => d.revenue)) * 1.1;
  const minRev = 0;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + innerH - ((d.revenue - minRev) / (maxRev - minRev)) * innerH,
    ...d,
  }));

  const linePath = points.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 3;
    const cpX2 = p.x - (p.x - prev.x) / 3;
    return `${prev ? '' : ''}C${cpX1},${prev.y} ${cpX2},${p.y} ${p.x},${p.y}`;
  }).join(' ');

  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.top + innerH} L${points[0].x},${pad.top + innerH} Z`;

  return (
    <motion.div
      className="dsh-chart"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dsh-chart-header">
        <div>
          <h3 className="dsh-chart-title">Revenue Overview</h3>
          <p className="dsh-chart-sub">Last 30 Days</p>
        </div>
        <div className="dsh-chart-legend">
          <span className="dsh-legend-dot" style={{ background: '#7C3AED' }} />
          <span className="dsh-legend-text">Revenue</span>
        </div>
      </div>
      <div className="dsh-chart-body">
        <svg viewBox={`0 0 ${width} ${height}`} className="dsh-chart-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={pad.left}
              y1={pad.top + innerH * (1 - pct)}
              x2={width - pad.right}
              y2={pad.top + innerH * (1 - pct)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          <motion.path
            d={areaPath}
            fill="url(#chartAreaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 0}
                fill="#7C3AED"
                stroke="#0F172A"
                strokeWidth="2"
                style={{ transition: 'r 0.2s ease' }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={12}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          ))}
        </svg>
        {hoveredIdx !== null && (
          <div
            className="dsh-chart-tooltip"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100}%`,
            }}
          >
            <span className="dsh-tooltip-val">${points[hoveredIdx].revenue.toLocaleString()}</span>
            <span className="dsh-tooltip-label">Day {points[hoveredIdx].day}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Activity Feed ── */
export function ActivityFeed({ items }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 3000);
    return () => clearInterval(id);
  }, [items.length]);

  const visible = [];
  for (let j = 0; j < Math.min(5, items.length); j++) {
    visible.push(items[(idx + j) % items.length]);
  }

  return (
    <motion.div
      className="dsh-activity"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="dsh-panel-title">Activity</h3>
      <div className="dsh-activity-list">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={item.id}
              className="dsh-activity-item"
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="dsh-activity-dot" style={{ background: item.color }} aria-hidden="true" />
              <div className="dsh-activity-body">
                <span className="dsh-activity-text"><strong>{item.user}</strong> {item.action}</span>
                <span className="dsh-activity-time">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Progress Card ── */
export function ProgressCard({ projects }) {
  return (
    <motion.div
      className="dsh-progress-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="dsh-panel-title">Project Progress</h3>
      <div className="dsh-progress-list">
        {projects.map((proj, i) => (
          <div key={proj.name} className="dsh-progress-item">
            <div className="dsh-progress-head">
              <span className="dsh-progress-name">{proj.name}</span>
              <span className="dsh-progress-pct">{proj.progress}%</span>
            </div>
            <div className="dsh-progress-track">
              <motion.div
                className="dsh-progress-fill"
                style={{ background: proj.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${proj.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Team Card ── */
export function TeamCard({ members }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <motion.div
      className="dsh-team-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="dsh-panel-title">Team Members</h3>
      <div className="dsh-team-list">
        {members.map((m, i) => (
          <div
            key={m.name}
            className="dsh-team-item"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="dsh-team-avatar" style={{ background: m.gradient }} aria-hidden="true">
              {m.initials}
            </div>
            <div className="dsh-team-info">
              <span className="dsh-team-name">{m.name}</span>
              <span className="dsh-team-status" style={{ color: m.statusColor }}>{m.status}</span>
            </div>
            {hoveredIdx === i && (
              <motion.div
                className="dsh-team-tooltip"
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {m.name} — {m.status}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Floating Widget ── */
export function FloatingWidget({ label, value, color, style, delay = 0 }) {
  return (
    <motion.div
      className="dsh-floating-widget"
      style={style}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="dsh-widget-icon" style={{ background: color }} aria-hidden="true">
        {label === '+$8K Revenue' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>}
        {label === '99.9% Uptime' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
        {label === 'AI Active' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
      </div>
      <div className="dsh-widget-text">
        <span className="dsh-widget-label">{label}</span>
        <span className="dsh-widget-value">{value}</span>
      </div>
    </motion.div>
  );
}
