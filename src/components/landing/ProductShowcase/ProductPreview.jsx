import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DashboardHeader,
  KPICard,
  RevenueChart,
  ActivityFeed,
  ProgressCard,
  TeamCard,
} from './DashboardComponents';
import { kpiCards, activityItems, chartData, projects, teamMembers } from '../../../data/dashboardData';

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

        <section className="dsh-kpi-row">
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
      </div>
    </div>
  );
}

/* ── Analytics Preview ── */
function AnalyticsPreview({ prefersReduced }) {
  const [counters, setCounters] = useState({ conversion: 0, retention: 0, revenue: 0 });

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setCounters({ conversion: 234, retention: 689, revenue: 7.2 }), 100);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  const linePath = "M0,32 C10,28 20,24 30,28 C40,32 50,20 60,24 C70,28 80,16 90,20";

  const barHeights = [35, 50, 42, 65, 55, 72, 48, 60, 78, 52, 68, 58];

  return (
    <div className="analytics-preview" role="img" aria-label="FlowSync analytics interface">
      <header className="analytics-header">
        <div className="analytics-title-section">
          <h1 className="page-title">Analytics</h1>
          <div className="analytics-controls">
            <div className="date-selector">
              <span className="date-range">Oct 1 - Oct 31, 2024</span>
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
        <section className="main-chart-section">
          <div className="chart-header-with-legend">
            <h2 className="chart-title">Revenue Analytics</h2>
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot purple" aria-hidden="true" /> Revenue</div>
              <div className="legend-item"><div className="legend-dot blue" aria-hidden="true" /> Users</div>
              <div className="legend-item"><div className="legend-dot green" aria-hidden="true" /> Growth</div>
            </div>
          </div>
          <div className="chart-main-area">
            <div className="line-chart-container">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="line-chart">
                <defs>
                  <linearGradient id="analyticsLineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${linePath} L90,40 L0,40 Z`} fill="url(#analyticsLineGrad)" />
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle cx="80" cy="20" r="2.5" fill="#7C3AED" stroke="#0F172A" strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2, duration: 0.3 }} />
              </svg>
            </div>
            <div className="chart-summary-cards">
              <div className="summary-card">
                <div className="summary-icon conversion-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">{counters.conversion >= 234 ? "23.4%" : "0%"}</span>
                  <span className="summary-label">Conversion</span>
                  <span className="summary-trend positive">+12%</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon retention-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">{counters.retention >= 689 ? "68.9%" : "0%"}</span>
                  <span className="summary-label">Retention</span>
                  <span className="summary-trend positive">+3%</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon revenue-icon" aria-hidden="true" />
                <div className="summary-content">
                  <span className="summary-value">{counters.revenue >= 7.2 ? "$7.2M" : "$0"}</span>
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
              {barHeights.map((h, i) => (
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
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="12"
                  strokeDasharray="176 75" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#38BDF8" strokeWidth="12"
                  strokeDasharray="75 176" strokeDashoffset="-176" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12"
                  strokeDasharray="50 201" strokeDashoffset="-251" />
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
            <div className="ai-icon" aria-hidden="true" />
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
          <button className="export-btn">Export Insights</button>
        </aside>
      </main>
    </div>
  );
}

/* ── Automation Preview ── */
function AutomationPreview({ prefersReduced }) {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRunning(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="automation-preview" role="img" aria-label="FlowSync automation interface">
      <header className="automation-header">
        <div className="automation-title-section">
          <h1 className="page-title">Automation</h1>
          <div className="automation-status">
            <div className={`status-indicator ${isRunning ? "running" : ""}`} aria-hidden="true" />
            <span className="status-text">Active</span>
          </div>
        </div>
        <div className="automation-controls">
          <button className="control-btn primary">New Workflow</button>
          <button className="control-btn">Templates</button>
        </div>
      </header>

      <main className="automation-content">
        <section className="workflow-builder">
          <h2 className="builder-title">Visual Workflow Builder</h2>
          <div className="workflow-canvas">
            <div className="workflow-nodes-container">
              <motion.div className="workflow-node trigger-node" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <div className="node-icon trigger-icon" aria-hidden="true" />
                <div className="node-content">
                  <span className="node-label">Trigger</span>
                  <span className="node-sublabel">Schedule: Daily</span>
                </div>
              </motion.div>

              <div className="workflow-connector" aria-hidden="true">
                <svg viewBox="0 0 40 20" className="connector-svg">
                  <path d="M0,10 L40,10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  {isRunning && <motion.circle r="3" fill="#7C3AED"
                    initial={{ cx: 0, opacity: 0 }} animate={{ cx: 40, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />}
                </svg>
              </div>

              <motion.div className="workflow-node condition-node" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <div className="node-icon condition-icon" aria-hidden="true" />
                <div className="node-content">
                  <span className="node-label">Condition</span>
                  <span className="node-sublabel">If revenue over $1,000</span>
                </div>
              </motion.div>

              <div className="workflow-connector" aria-hidden="true">
                <svg viewBox="0 0 40 20" className="connector-svg">
                  <path d="M0,10 L40,10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  {isRunning && <motion.circle r="3" fill="#38BDF8"
                    initial={{ cx: 0, opacity: 0 }} animate={{ cx: 40, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }} />}
                </svg>
              </div>

              <motion.div className="workflow-node action-node active" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                <div className="node-icon ai-icon" aria-hidden="true" />
                <div className="node-content">
                  <span className="node-label">AI Action</span>
                  <span className="node-sublabel">Generate insights</span>
                </div>
                {isRunning && <div className="running-indicator" aria-hidden="true" />}
              </motion.div>

              <div className="workflow-connector" aria-hidden="true">
                <svg viewBox="0 0 40 20" className="connector-svg">
                  <path d="M0,10 L40,10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  {isRunning && <motion.circle r="3" fill="#10B981"
                    initial={{ cx: 0, opacity: 0 }} animate={{ cx: 40, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 }} />}
                </svg>
              </div>

              <motion.div className="workflow-node notification-node" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
                <div className="node-icon notif-icon" aria-hidden="true" />
                <div className="node-content">
                  <span className="node-label">Notification</span>
                  <span className="node-sublabel">Send email</span>
                </div>
              </motion.div>
            </div>

            <div className="workflow-triggers-panel">
              <div className="trigger-card">
                <div className="trigger-icon-wrap clock-icon" aria-hidden="true" />
                <div className="trigger-content">
                  <span className="trigger-title">Schedule</span>
                  <span className="trigger-subtitle">Daily at 9 AM</span>
                </div>
                <div className="trigger-toggle" aria-label="Toggle schedule trigger">
                  <div className="toggle-track"><div className="toggle-thumb" /></div>
                </div>
              </div>
              <div className="trigger-card active">
                <div className="trigger-icon-wrap email-icon" aria-hidden="true" />
                <div className="trigger-content">
                  <span className="trigger-title">Email Alert</span>
                  <span className="trigger-subtitle">Send notification</span>
                </div>
                <div className="trigger-toggle active" aria-label="Toggle email trigger">
                  <div className="toggle-track"><div className="toggle-thumb" /></div>
                </div>
              </div>
              <div className="trigger-card">
                <div className="trigger-icon-wrap webhook-icon" aria-hidden="true" />
                <div className="trigger-content">
                  <span className="trigger-title">Webhook</span>
                  <span className="trigger-subtitle">POST to API</span>
                </div>
                <div className="trigger-toggle" aria-label="Toggle webhook trigger">
                  <div className="toggle-track"><div className="toggle-thumb" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Collaboration Preview ── */
function CollaborationPreview({ prefersReduced }) {
  const [onlineUsers, setOnlineUsers] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineUsers((prev) => prev + (Math.random() > 0.5 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="collaboration-preview" role="img" aria-label="FlowSync collaboration interface">
      <header className="collaboration-header">
        <div className="collaboration-title-section">
          <h1 className="page-title">Team Workspace</h1>
          <div className="team-status">
            <div className="team-indicator" aria-hidden="true" />
            <span className="status-text">4 active projects</span>
          </div>
        </div>
        <div className="team-panel">
          <div className="avatar-stack">
            <div className="avatar-sm avatar-1" aria-hidden="true">AC</div>
            <div className="avatar-sm avatar-2" aria-hidden="true">SK</div>
            <div className="avatar-sm avatar-3" aria-hidden="true">MJ</div>
            <div className="avatar-more">+{onlineUsers > 3 ? onlineUsers - 3 : 1}</div>
          </div>
          <div className="presence-indicator">
            <div className="presence-dot active" aria-hidden="true" />
            <span className="presence-text">Online</span>
          </div>
        </div>
      </header>

      <main className="collaboration-content">
        <aside className="workspace-sidebar">
          <div className="sidebar-members">
            <h3 className="sidebar-title">Team Members</h3>
            <div className="members-list">
              {[
                { name: "Alex Chen", role: "Admin", status: "active", color: "#2563EB" },
                { name: "Sarah Kim", role: "Developer", status: "active", color: "#7C3AED" },
                { name: "Mike Johnson", role: "Designer", status: "away", color: "#F59E0B" },
                { name: "Emma Davis", role: "Manager", status: "active", color: "#10B981" },
              ].map((member, i) => (
                <motion.div key={i} className="member-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.6 }}>
                  <div className="member-avatar" style={{ background: member.color }} aria-hidden="true">{member.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <div className={`member-status ${member.status}`} aria-hidden="true" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="sidebar-files">
            <h3 className="sidebar-title">Shared Files</h3>
            <div className="files-list">
              {[
                { name: "brief_v2.pdf", size: "2.4 MB", icon: "📄" },
                { name: "assets.zip", size: "14.8 MB", icon: "📦" },
                { name: "flows.png", size: "1.1 MB", icon: "🖼️" },
              ].map((file, i) => (
                <motion.div key={i} className="file-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.8 }} whileHover={{ x: 2 }}>
                  <span className="file-icon" aria-hidden="true">{file.icon}</span>
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{file.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        <section className="workspace-main">
          <header className="workspace-header">
            <h2 className="workspace-title">Project Kanban</h2>
            <button className="action-btn primary">New Task</button>
          </header>

          <div className="kanban-container">
            <div className="kanban-column">
              <div className="kanban-header">
                <h3 className="kanban-title">To Do</h3>
                <div className="kanban-count">3</div>
              </div>
              <div className="kanban-cards">
                {[
                  { title: "Design login page", priority: "high", comments: 3 },
                  { title: "API integration", priority: "medium", comments: 1 },
                  { title: "Database schema", priority: "high", comments: 0 },
                ].map((card, i) => (
                  <motion.div key={i} className="kanban-card todo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 1.0 }} whileHover={{ scale: 1.02, y: -2 }}>
                    <h4 className="card-title">{card.title}</h4>
                    <div className="card-meta">
                      <span className={`priority-badge ${card.priority}`}>{card.priority}</span>
                      {card.comments > 0 && (
                        <span className="comment-count">{card.comments} comments</span>
                      )}
                    </div>
                    {i === 0 && (
                      <div className="typing-indicator" aria-label="Someone is typing">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="kanban-column">
              <div className="kanban-header">
                <h3 className="kanban-title">In Progress</h3>
                <div className="kanban-count">2</div>
              </div>
              <div className="kanban-cards">
                {[
                  { title: "UX research", priority: "medium", comments: 2 },
                  { title: "Testing suite", priority: "high", comments: 5 },
                ].map((card, i) => (
                  <motion.div key={i} className="kanban-card in-progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 1.2 }} whileHover={{ scale: 1.02, y: -2 }}>
                    <h4 className="card-title">{card.title}</h4>
                    <div className="card-meta">
                      <span className={`priority-badge ${card.priority}`}>{card.priority}</span>
                      {card.comments > 0 && (
                        <span className="comment-count">{card.comments} comments</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="workspace-right">
          <div className="comments-panel">
            <h3 className="sidebar-title">Comments</h3>
            <div className="comments-list">
              {[
                { user: "Sarah Kim", text: "Pushed revisions!", time: "5m ago", avatar: "SK", color: "#7C3AED" },
                { user: "Alex Chen", text: "Looks clean!", time: "2m ago", avatar: "AC", color: "#2563EB" },
              ].map((cmt, i) => (
                <div key={i} className="comment-bubble-item">
                  <div className="comment-avatar" style={{ background: cmt.color }}>{cmt.avatar}</div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-user">{cmt.user}</span>
                      <span className="comment-time">{cmt.time}</span>
                    </div>
                    <p className="comment-text">{cmt.text}</p>
                  </div>
                </div>
              ))}
              <div className="typing-indicator-chat">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-text">Mike is typing...</span>
              </div>
            </div>
          </div>

          <div className="activity-timeline">
            <h3 className="timeline-title">Activity</h3>
            <div className="timeline-items">
              {[
                { user: "Alex", action: "commented", target: "Login design", time: "2m ago", color: "#2563EB" },
                { user: "Sarah", action: "shared file", target: "brief_v2.pdf", time: "15m ago", color: "#7C3AED" },
                { user: "Mike", action: "completed", target: "DB schema", time: "1h ago", color: "#F59E0B" },
              ].map((item, i) => (
                <motion.div key={i} className="timeline-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 1.5 }}>
                  <div className="timeline-avatar" style={{ background: item.color }} aria-hidden="true">{item.user[0]}</div>
                  <div className="timeline-content">
                    <span className="timeline-user">{item.user} </span>
                    <span className="timeline-action">{item.action} </span>
                    <span className="timeline-target">{item.target}</span>
                    <span className="timeline-time">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

const previewComponents = {
  dashboard: DashboardPreview,
  analytics: AnalyticsPreview,
  automation: AutomationPreview,
  collaboration: CollaborationPreview,
};

export default function ProductPreview({ categoryId, prefersReduced }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const PreviewComponent = previewComponents[categoryId] || DashboardPreview;

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
      <div className="showcase-preview" role="tabpanel" id={`panel-${categoryId}`} aria-labelledby={`tab-${categoryId}`}>
        <AnimatePresence mode="wait">
          <motion.div key={categoryId} variants={previewTransition} initial="initial" animate="animate" exit="exit">
            <PreviewComponent prefersReduced={prefersReduced} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
