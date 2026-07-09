/* ================================
   FLOWSYNC — Product Showcase Data
   ================================ */

export const categories = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'collaboration', label: 'Collaboration' },
];

export const previewData = {
  dashboard: {
    label: 'Dashboard Preview',
    description: 'KPI cards and analytics dashboard',
    illustration: 'dashboard-preview',
    features: [
      { icon: 'kpi', label: 'KPI Cards', value: '54,200' },
      { icon: 'chart', label: 'Revenue', value: '$12.4M' },
      { icon: 'activity', label: 'Team Growth', value: '+18%' },
    ],
  },
  analytics: {
    label: 'Analytics Preview',
    description: 'Charts and reports visualization',
    illustration: 'analytics-preview',
    chartType: 'line',
    metrics: [
      { label: 'Conversion', value: '23.4%', trend: '+12%' },
      { label: 'Retention', value: '68.9%', trend: '+3%' },
      { label: 'Revenue', value: '$7.2M', trend: '+25%' },
    ],
  },
  automation: {
    label: 'Automation Preview',
    description: 'Workflow builder interface',
    illustration: 'automation-preview',
    nodes: 5,
    connections: 3,
    status: 'Active',
  },
  collaboration: {
    label: 'Collaboration Preview',
    description: 'Team management workspace',
    illustration: 'collaboration-preview',
    activeUsers: 48,
    teams: 4,
    projects: 12,
  },
};

export const features = {
  dashboard: [
    {
      icon: 'kpi',
      title: 'KPI Tracking',
      desc: 'Monitor revenue, user growth, and engagement with real-time KPI cards and live metrics.',
    },
    {
      icon: 'chart',
      title: 'Revenue Analytics',
      desc: 'Visualize revenue trends with interactive charts and forecast projections at a glance.',
    },
    {
      icon: 'activity',
      title: 'Activity Feed',
      desc: 'Stay updated with team activity, project milestones, and automated workflow triggers.',
    },
    {
      icon: 'notification',
      title: 'Smart Notifications',
      desc: 'Get intelligent alerts on anomalies, milestones, and important business events.',
    },
  ],
  analytics: [
    {
      icon: 'chart',
      title: 'Advanced Analytics',
      desc: 'Deep-dive into performance data with cohort analysis, retention metrics, and funnel reports.',
    },
    {
      icon: 'report',
      title: 'Custom Reports',
      desc: 'Build tailored reports with drag-and-drop widgets, filters, and scheduled exports.',
    },
    {
      icon: 'kpi',
      title: 'Predictive Insights',
      desc: 'Leverage AI-powered forecasting to predict trends and make data-driven decisions.',
    },
    {
      icon: 'notification',
      title: 'Anomaly Detection',
      desc: 'Automatically detect unusual patterns and receive alerts before issues escalate.',
    },
  ],
  automation: [
    {
      icon: 'workflow',
      title: 'Workflow Builder',
      desc: 'Design complex automation pipelines with a visual drag-and-drop workflow editor.',
    },
    {
      icon: 'ai',
      title: 'AI Automation',
      desc: 'Automate repetitive tasks with intelligent AI agents that learn from your processes.',
    },
    {
      icon: 'integration',
      title: 'Seamless Integrations',
      desc: 'Connect with 200+ tools including Slack, GitHub, Jira, and Salesforce out of the box.',
    },
    {
      icon: 'notification',
      title: 'Trigger Rules',
      desc: 'Define conditional triggers that automatically execute actions based on events.',
    },
  ],
  collaboration: [
    {
      icon: 'team',
      title: 'Team Collaboration',
      desc: 'Collaborate in real time with shared workspaces, comments, and live document editing.',
    },
    {
      icon: 'workflow',
      title: 'Project Management',
      desc: 'Manage tasks, sprints, and milestones with Kanban boards, Gantt charts, and timelines.',
    },
    {
      icon: 'notification',
      title: 'Team Communication',
      desc: 'Stay connected with built-in messaging, video calls, and threaded discussions.',
    },
    {
      icon: 'integration',
      title: 'Permission Controls',
      desc: 'Set granular access controls, roles, and permissions for secure team collaboration.',
    },
  ],
};

export const previewContent = {
  dashboard: {
    label: 'Dashboard Preview',
    description: 'Real-time KPI cards, revenue trend charts, and team activity feed in a unified dashboard view.',
  },
  analytics: {
    label: 'Analytics Preview',
    description: 'Interactive charts, cohort analysis, funnel reports, and predictive insights for data-driven decisions.',
  },
  automation: {
    label: 'Automation Preview',
    description: 'Visual workflow builder with drag-and-drop nodes, conditional triggers, and AI-powered automation.',
  },
  collaboration: {
    label: 'Collaboration Preview',
    description: 'Team workspace with Kanban boards, live editing, threaded comments, and project timelines.',
  },
};