import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DashboardHeader,
  KPICard,
  RevenueChart,
  ActivityFeed,
  ProgressCard,
  TeamCard,
  FloatingWidget,
} from './DashboardComponents';
import {
  kpiCards,
  activityItems,
  chartData,
  projects,
  teamMembers,
  floatingWidgets,
  analyticsKpiCards,
} from '../../../data/dashboardData';

const ANALYTICS_SERIES = [
  { key: 'revenue', color: '#7C3AED', gradId: 'analyticsLineGrad', data: [42, 50, 47, 60, 68, 64, 77, 85, 81, 92, 97, 108] },
  { key: 'users', color: '#2563EB', gradId: 'analyticsLineGrad2', data: [33, 41, 45, 43, 52, 58, 55, 64, 70, 67, 76, 84] },
  { key: 'conversions', color: '#10B981', gradId: 'analyticsLineGrad3', data: [22, 28, 31, 27, 35, 40, 38, 46, 51, 48, 56, 63] },
];

function buildSmoothPath(pts) {
  if (!pts || pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const previewTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Dashboard Preview ── */
function DashboardPreview({ prefersReduced }) {
  const [kpiValues, setKpiValues] = useState(() => kpiCards.map((c) => c.value));
  const [notifCount, setNotifCount] = useState(3);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setKpiValues((prev) =>
        prev.map((v, i) => {
          if (i === 0) return v + Math.floor(Math.random() * 80 + 20);
          if (i === 1) return v + Math.floor(Math.random() * 8 + 1);
          if (i === 2) return v + Math.floor(Math.random() * 4 + 1);
          return Math.round((v + (Math.random() * 0.2 - 0.05)) * 10) / 10;
        })
      );
      setNotifCount((v) => (v % 5) + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div className="dsh-root">
      <div className="dsh-container">
        <DashboardHeader notifCount={notifCount} />

        <section className="dsh-kpi-row" aria-label="Key metrics">
          {kpiCards.map((card, i) => (
            <KPICard key={card.id} card={card} index={i} value={kpiValues[i]} />
          ))}
        </section>

        <section className="dsh-middle">
          <RevenueChart data={chartData} />
          <ActivityFeed items={activityItems} />
        </section>

        <section className="dsh-bottom">
          <ProgressCard projects={projects} />
          <TeamCard members={teamMembers} />
        </section>

        {floatingWidgets.map((widget) => (
          <FloatingWidget
            key={widget.id}
            label={widget.label}
            value={widget.value}
            color={widget.color}
            position={widget.position}
            delay={widget.id * 0.15}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Analytics Preview ── */
function AnalyticsPreview({ prefersReduced }) {
  const [analyticsKpiValues, setAnalyticsKpiValues] = useState(() => analyticsKpiCards.map((c) => c.value));

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setAnalyticsKpiValues((prev) =>
        prev.map((v, i) => {
          const card = analyticsKpiCards[i];
          if (i === 0) return v + Math.floor(Math.random() * (card.incrementRange[1] - card.incrementRange[0]) + card.incrementRange[0]);
          if (i === 1) return Math.round((v + (Math.random() * (card.incrementRange[1] - card.incrementRange[0]) + card.incrementRange[0])) * 10) / 10;
          if (i === 2) return Math.round((v + (Math.random() * (card.incrementRange[1] - card.incrementRange[0]) + card.incrementRange[0])) * 10) / 10;
          return Math.round((v + (Math.random() * (card.incrementRange[1] - card.incrementRange[0]) + card.incrementRange[0])) * 100) / 100;
        })
      );
    }, 4500);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div className="analytics-preview" role="img" aria-label="FlowSync analytics interface">
      <header className="analytics-header">
        <div className="analytics-title-section">
          <h2 className="page-title">Analytics</h2>
          <div className="analytics-controls">
            <div className="date-selector">
              <span className="date-range">Last 30 Days</span>
            </div>
            <div className="filter-chips">
              <div className="filter-chip active">All Data</div>
              <div className="filter-chip">Revenue</div>
              <div className="filter-chip">Users</div>
              <div className="filter-chip">Products</div>
            </div>
          </div>
        </div>
      </header>

      <main className="analytics-content">
        <section className="analytics-grid" aria-label="Key metrics">
          {analyticsKpiCards.map((card, i) => (
            <KPICard key={card.id} card={card} index={i} value={analyticsKpiValues[i]} />
          ))}
        </section>

        <section className="main-chart-section">
          <div className="chart-header-with-legend">
            <h2 className="chart-title">Revenue Growth</h2>
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot purple" aria-hidden="true" /> Revenue</div>
              <div className="legend-item"><div className="legend-dot blue" aria-hidden="true" /> Users</div>
              <div className="legend-item"><div className="legend-dot green" aria-hidden="true" /> Conversions</div>
            </div>
          </div>
          <div className="chart-main-area">
            <div className="line-chart-container">
              <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="line-chart" aria-label="Revenue, users and conversions growth over 12 months">
                <defs>
                  <linearGradient id="analyticsLineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="analyticsLineGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="analyticsLineGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  {ANALYTICS_SERIES.map((s, si) => (
                    <clipPath key={s.key} id={`analyticsClip-${s.key}`}>
                      <motion.rect
                        x="0"
                        y="0"
                        height="120"
                        initial={{ width: 0 }}
                        animate={{ width: 320 }}
                        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 + si * 0.15 }}
                      />
                    </clipPath>
                  ))}
                </defs>

                {[0, 1, 2, 3, 4].map((g) => (
                  <line
                    key={g}
                    x1="8"
                    x2="312"
                    y1={14 + g * 23}
                    y2={14 + g * 23}
                    stroke="var(--border-subtle)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {ANALYTICS_SERIES.map((s, si) => {
                  const coords = s.data.map((v, i) => [
                    8 + (i * 304) / (s.data.length - 1),
                    112 - (v / 120) * 92,
                  ]);
                  const linePath = buildSmoothPath(coords);
                  const areaPath = `${linePath} L ${coords[coords.length - 1][0]},112 L ${coords[0][0]},112 Z`;
                  return (
                    <g key={s.key} clipPath={`url(#analyticsClip-${s.key})`}>
                      <motion.path
                        d={areaPath}
                        fill={`url(#${s.gradId})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + si * 0.1, duration: 0.6 }}
                      />
                      <path
                        d={linePath}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3" fill={s.color} vectorEffect="non-scaling-stroke" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="chart-summary-cards">
              <div className="summary-card">
                <div className="summary-icon conversion-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">23.4%</span>
                  <span className="summary-label">Conversion</span>
                  <span className="summary-trend positive">+12%</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon retention-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">68.9%</span>
                  <span className="summary-label">Retention</span>
                  <span className="summary-trend positive">+3%</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon revenue-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">$7.2M</span>
                  <span className="summary-label">Revenue</span>
                  <span className="summary-trend negative">-5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="secondary-charts">
          <div className="bar-chart-section">
            <h3 className="section-title">Monthly Growth</h3>
            <div className="bar-chart-container">
              {[35, 50, 42, 65, 55, 72, 48, 60, 78, 52, 68, 58].map((h, i) => (
                <motion.div key={i} className="bar-chart-bar" style={{ height: `${h}%` }}
                  initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: i * 0.06 + 0.8, duration: 0.3 }}>
                  <span className="bar-value">{h}%</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pie-chart-section">
            <h3 className="section-title">Distribution</h3>
            <div className="pie-chart-container">
              <svg viewBox="0 0 100 100" className="pie-chart">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="12" strokeDasharray="176 75" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#38BDF8" strokeWidth="12" strokeDasharray="75 176" strokeDashoffset="-176" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="50 201" strokeDashoffset="-251" />
              </svg>
              <div className="pie-legend">
                <div className="legend-item"><div className="legend-dot purple" aria-hidden="true" /> Revenue 55%</div>
                <div className="legend-item"><div className="legend-dot blue" aria-hidden="true" /> Users 24%</div>
                <div className="legend-item"><div className="legend-dot green" aria-hidden="true" /> Other 21%</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="ai-insights-panel">
          <div className="panel-header">
            <div className="ai-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="panel-title">AI Insights</h3>
          </div>
          <div className="insights-content">
            <div className="insight-item">
              <div className="insight-dot" aria-hidden="true" />
              <div className="insight-text"><span className="insight-label">Anomaly detected:</span> Revenue dip in Europe</div>
            </div>
            <div className="insight-item">
              <div className="insight-dot" aria-hidden="true" />
              <div className="insight-text"><span className="insight-label">Opportunity:</span> Asia Pacific growth potential</div>
            </div>
            <div className="insight-item">
              <div className="insight-dot" aria-hidden="true" />
              <div className="insight-text"><span className="insight-label">Recommendation:</span> Optimize campaigns for Q4</div>
            </div>
          </div>
          <button className="export-btn">
            Export Report
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </aside>
      </main>

      <footer className="analytics-footer">
        Data updates every 5 minutes
      </footer>
    </div>
  );
}

export default function ProductPreview({ categoryId, prefersReduced }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
      setTilt({ x, y });
    },
    [prefersReduced]
  );

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      className="showcase-preview-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
      }}
    >
      <div className="showcase-preview-glow" aria-hidden="true" />
      <div className="showcase-preview-ring" aria-hidden="true" />
      <div
        className="showcase-preview"
        role="tabpanel"
        id={`panel-${categoryId}`}
        aria-labelledby={`tab-${categoryId}`}
        aria-label="FlowSync dashboard preview"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={categoryId}
            variants={previewTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {categoryId === 'analytics' ? (
              <AnalyticsPreview prefersReduced={prefersReduced} />
            ) : (
              <DashboardPreview prefersReduced={prefersReduced} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}