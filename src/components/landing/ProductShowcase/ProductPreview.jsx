import { useState, useEffect, Fragment } from 'react';
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
  automationKpiCards,
  automationWorkflowNodes,
  automationActivity,
  automationPerformance,
  automationSuggestions,
  automationIntegrations,
  collaborationKpiCards,
  collaborationKanban,
  collaborationActivity,
  collaborationMembers,
  collaborationProjects,
  collaborationFiles,
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

/* ── Automation Preview ── */
const WF_TONE = { purple: '#7C3AED', blue: '#2563EB', green: '#10B981' };

const WF_ICONS = {
  trigger: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  mail: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>
  ),
  crm: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" /><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
  ),
  chart: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
};

function AutomationPreview({ prefersReduced }) {
  const [kpiValues, setKpiValues] = useState(() => automationKpiCards.map((c) => c.value));
  const [notifCount] = useState(3);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setKpiValues((prev) =>
        prev.map((v, i) => {
          const card = automationKpiCards[i];
          const [min, max] = card.incrementRange;
          if (card.id === 'activeWorkflows') return v + (Math.random() < 0.5 ? 1 : 0);
          if (card.id === 'successRate') return Math.min(99.9, Math.round((v + (Math.random() * (max - min) + min)) * 10) / 10);
          return Math.round((v + (Math.random() * (max - min) + min)) * 10) / 10;
        })
      );
    }, 4200);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const perfMax = Math.max(...automationPerformance.map((p) => p.value));

  return (
    <div className="dsh-root">
      <div className="dsh-container automation-container">
        <header className="dsh-header">
          <div className="dsh-header-left">
            <div className="dsh-logo" aria-hidden="true" />
            <span className="dsh-logo-text">Automation</span>
          </div>
          <div className="dsh-header-center">
            <div className="auto-status-select">
              <span className="auto-status-dot" aria-hidden="true" />
              <span>Workflow Status: Active</span>
              <svg className="auto-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
          <div className="dsh-header-right">
            <button className="auto-create-btn" type="button">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Create Workflow
            </button>
            <button className="dsh-icon-btn" type="button" aria-label="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
              <span className="dsh-notif-badge">{notifCount}</span>
            </button>
            <div className="dsh-avatar" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} aria-label="User menu">
              <span>JD</span>
              <span className="dsh-avatar-status" aria-hidden="true" />
            </div>
          </div>
        </header>

        <section className="dsh-kpi-row" aria-label="Key metrics">
          {automationKpiCards.map((card, i) => (
            <KPICard key={card.id} card={card} index={i} value={kpiValues[i]} />
          ))}
        </section>

        <section className="dsh-middle">
          <div className="dsh-chart">
            <div className="dsh-chart-header">
              <div>
                <h3 className="dsh-chart-title">Workflow Builder</h3>
                <p className="dsh-chart-sub">New Customer Onboarding</p>
              </div>
              <div className="dsh-chart-legend">
                <span className="dsh-legend-dot" style={{ background: '#7C3AED' }} />
                <span className="dsh-legend-text">5 steps</span>
              </div>
            </div>
            <div className="auto-workflow">
              {automationWorkflowNodes.map((node, i) => (
                <Fragment key={node.id}>
                  <motion.div
                    className={`auto-wf-node auto-wf-node--${node.tone}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="auto-wf-node-icon" style={{ background: WF_TONE[node.tone] }} aria-hidden="true">
                      {WF_ICONS[node.icon]}
                    </div>
                    <div className="auto-wf-node-body">
                      <span className="auto-wf-node-type">{node.type}</span>
                      <span className="auto-wf-node-title">{node.title}</span>
                    </div>
                    <span className={`auto-wf-badge auto-wf-badge--${node.tone}`}>{node.badge}</span>
                  </motion.div>
                  {i < automationWorkflowNodes.length - 1 && (
                    <div className="auto-wf-connector" aria-hidden="true">
                      <span className="auto-wf-flow" style={{ animationDelay: `${i * 0.4}s` }} />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="dsh-activity">
            <h3 className="dsh-panel-title">Workflow Activity</h3>
            <div className="auto-activity-list">
              {automationActivity.map((item) => (
                <div className="auto-activity-item" key={item.id}>
                  <span className={`auto-act-icon auto-act-icon--${item.tone}`} aria-hidden="true">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <div className="auto-act-body">
                    <span className="auto-act-text">{item.text}</span>
                    <span className="auto-act-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dsh-bottom">
          <div className="dsh-progress-card">
            <h3 className="dsh-panel-title">Automation Performance</h3>
            <div className="auto-perf-bars">
              {automationPerformance.map((p, i) => (
                <div className="auto-perf-col" key={p.day}>
                  <span className="auto-perf-val">{p.value}</span>
                  <div className="auto-perf-track">
                    <motion.div
                      className="auto-perf-bar"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom', height: `${(p.value / perfMax) * 100}%` }}
                    />
                  </div>
                  <span className="auto-perf-label">{p.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dsh-team-card">
            <h3 className="dsh-panel-title">AI Suggestions</h3>
            <div className="auto-suggest-list">
              {automationSuggestions.map((s, i) => (
                <div className="auto-suggest-item" key={i}>
                  <span className="auto-suggest-spark" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" /></svg>
                  </span>
                  <span className="auto-suggest-text">{s}</span>
                </div>
              ))}
            </div>
            <h3 className="dsh-panel-title auto-integrations-title">Active Integrations</h3>
            <div className="auto-integrations">
              {automationIntegrations.map((it) => (
                <div className="auto-integration" key={it.name}>
                  <span className="auto-integration-icon" style={{ background: it.color }} aria-hidden="true">{it.name[0]}</span>
                  <span className="auto-integration-name">{it.name}</span>
                  <span className="auto-connected">Connected</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="automation-footer">
          Last automation executed 1 minute ago
        </footer>
      </div>
    </div>
  );
}

/* ── Collaboration Preview ── */
function ProgressRing({ value, label, color, delay = 0.6 }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="collab-ring">
      <div className="collab-ring-svg-wrap">
        <svg viewBox="0 0 64 64" className="collab-ring-svg" aria-hidden="true">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <g transform="rotate(-90 32 32)">
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
              transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
        </svg>
        <span className="collab-ring-val">{value}%</span>
      </div>
      <span className="collab-ring-label">{label}</span>
    </div>
  );
}

function CollaborationPreview({ prefersReduced }) {
  const [kpiValues, setKpiValues] = useState(() => collaborationKpiCards.map((c) => c.value));

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setKpiValues((prev) =>
        prev.map((v, i) => {
          const card = collaborationKpiCards[i];
          const [min, max] = card.incrementRange;
          if (card.id === 'teamProductivity') return Math.min(99.9, Math.round((v + (Math.random() * (max - min) + min)) * 10) / 10);
          if (card.id === 'teamMembers' || card.id === 'activeProjects') return v + (Math.random() < 0.4 ? 1 : 0);
          return Math.round((v + (Math.random() * (max - min) + min)) * 10) / 10;
        })
      );
    }, 4300);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div className="dsh-root">
      <div className="dsh-container collaboration-container">
        <header className="dsh-header">
          <div className="dsh-header-left">
            <div className="dsh-logo" aria-hidden="true" />
            <span className="dsh-logo-text">Team Workspace</span>
          </div>
          <div className="dsh-header-center">
            <div className="dsh-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" className="dsh-search-input" placeholder="Search workspace..." readOnly aria-label="Search workspace" />
            </div>
          </div>
          <div className="dsh-header-right">
            <button className="collab-invite-btn" type="button">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
              Invite Member
            </button>
            <button className="dsh-icon-btn" type="button" aria-label="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
              <span className="dsh-notif-badge">2</span>
            </button>
            <div className="dsh-avatar" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} aria-label="User menu">
              <span>JD</span>
              <span className="dsh-avatar-status" aria-hidden="true" />
            </div>
          </div>
        </header>

        <section className="dsh-kpi-row" aria-label="Key metrics">
          {collaborationKpiCards.map((card, i) => (
            <KPICard key={card.id} card={card} index={i} value={kpiValues[i]} />
          ))}
        </section>

        <section className="dsh-middle">
          <div className="dsh-chart">
            <div className="dsh-chart-header">
              <div>
                <h3 className="dsh-chart-title">Team Board</h3>
                <p className="dsh-chart-sub">Sprint 24</p>
              </div>
              <div className="dsh-chart-legend">
                <span className="dsh-legend-dot" style={{ background: '#7C3AED' }} />
                <span className="dsh-legend-text">8 tasks</span>
              </div>
            </div>
            <div className="collab-kanban">
              {collaborationKanban.map((col) => (
                <div className="collab-kanban-col" key={col.title}>
                  <div className="collab-kanban-col-head">
                    <span>{col.title}</span>
                    <span className="collab-kanban-col-count">{col.cards.length}</span>
                  </div>
                  {col.cards.map((task) => (
                    <motion.div
                      key={task.title}
                      className="collab-kanban-card"
                      whileHover={{ y: -3 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                      <div className="collab-kanban-card-head">
                        <span className="collab-kanban-card-title">{task.title}</span>
                        <span className={`collab-kanban-priority collab-kanban-priority--${task.priority}`}>
                          {task.priority === 'high' ? 'High' : task.priority === 'med' ? 'Med' : 'Low'}
                        </span>
                      </div>
                      <div className="collab-kanban-card-foot">
                        <span className="collab-kanban-avatar" style={{ background: task.gradient }} aria-hidden="true">{task.assignee}</span>
                        <span className="collab-kanban-due">{task.due}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="dsh-activity">
            <h3 className="dsh-panel-title">Team Activity</h3>
            <div className="collab-act-list">
              {collaborationActivity.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="collab-act-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="collab-act-avatar" style={{ background: item.gradient }} aria-hidden="true">{item.user[0]}</span>
                  <div className="collab-act-body">
                    <span className="collab-act-text"><strong>{item.user}</strong> {item.action}</span>
                    <span className="collab-act-time">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 className="dsh-panel-title collab-avail-title">Team Availability</h3>
            <div className="collab-avail-list">
              {collaborationMembers.map((m) => (
                <div className="collab-avail-item" key={m.name}>
                  <span className="collab-avail-avatar" style={{ background: m.gradient }} aria-hidden="true">{m.initials}</span>
                  <div className="collab-avail-info">
                    <span className="collab-avail-name">{m.name}</span>
                    <span className="collab-avail-status" style={{ color: m.statusColor }}>{m.status}</span>
                  </div>
                  <span className="collab-avail-dot" style={{ background: m.statusColor }} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dsh-bottom">
          <div className="dsh-progress-card">
            <h3 className="dsh-panel-title">Project Progress</h3>
            <div className="collab-rings">
              {collaborationProjects.map((p, i) => (
                <ProgressRing key={p.label} value={p.value} label={p.label} color={p.color} delay={0.6 + i * 0.15} />
              ))}
            </div>
          </div>

          <div className="dsh-team-card">
            <h3 className="dsh-panel-title">Shared Files</h3>
            <div className="collab-files">
              {collaborationFiles.map((f) => (
                <div className="collab-file-item" key={f.name}>
                  <span className="collab-file-icon" style={{ background: `${f.color}22`, color: f.color }} aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </span>
                  <div className="collab-file-body">
                    <span className="collab-file-name">{f.name}</span>
                    <span className="collab-file-meta">{f.owner} · {f.modified}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="collaboration-footer">
          12 teammates currently online
        </footer>
      </div>
    </div>
  );
}

export default function ProductPreview({ categoryId, prefersReduced }) {
  return (
    <motion.div className="showcase-preview-wrapper">
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
            ) : categoryId === 'automation' ? (
              <AutomationPreview prefersReduced={prefersReduced} />
            ) : categoryId === 'collaboration' ? (
              <CollaborationPreview prefersReduced={prefersReduced} />
            ) : (
              <DashboardPreview prefersReduced={prefersReduced} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}