/* ================================
   FLOWSYNC — Dashboard Mock Data
   Premium SaaS Dashboard Data
   ================================ */

export const kpiCards = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: 48250,
    prefix: '$',
    suffix: '',
    change: 12.4,
    positive: true,
    gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    sparkline: [32, 28, 34, 30, 38, 35, 42, 39, 45, 43, 48, 46],
    incrementRange: [20, 80],
  },
  {
    id: 'users',
    label: 'Active Users',
    value: 18420,
    prefix: '',
    suffix: '',
    change: 8.2,
    positive: true,
    gradient: 'linear-gradient(135deg, #10B981, #2563EB)',
    sparkline: [20, 22, 21, 24, 23, 26, 25, 28, 27, 30, 29, 32],
    incrementRange: [1, 8],
  },
  {
    id: 'workflows',
    label: 'Running Workflows',
    value: 342,
    prefix: '',
    suffix: '',
    change: 5.7,
    positive: true,
    gradient: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    sparkline: [15, 18, 16, 20, 19, 22, 21, 24, 23, 26, 25, 28],
    incrementRange: [1, 4],
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: 3.8,
    prefix: '',
    suffix: '%',
    change: 0.4,
    positive: true,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    sparkline: [28, 30, 29, 32, 31, 34, 33, 36, 35, 38, 37, 40],
    incrementRange: [0.05, 0.15],
  },
];

export const activityItems = [
  { id: 1, user: 'Sarah', action: 'created a workflow', time: '2 min ago', color: '#7C3AED' },
  { id: 2, user: 'System', action: 'Invoice paid — $2,400', time: '5 min ago', color: '#10B981' },
  { id: 3, user: 'AI', action: 'Generated quarterly report', time: '9 min ago', color: '#2563EB' },
  { id: 4, user: 'Emma', action: 'joined workspace', time: '12 min ago', color: '#EC4899' },
  { id: 5, user: 'Alex', action: 'completed marketing automation', time: '18 min ago', color: '#F59E0B' },
  { id: 6, user: 'Olivia', action: 'deployed v2.4.1', time: '22 min ago', color: '#38BDF8' },
  { id: 7, user: 'Noah', action: 'updated billing settings', time: '28 min ago', color: '#8B5CF6' },
  { id: 8, user: 'System', action: 'Backup completed', time: '35 min ago', color: '#10B981' },
];

export const chartData = [
  { day: 1, revenue: 1200, users: 340 },
  { day: 4, revenue: 1450, users: 380 },
  { day: 7, revenue: 1320, users: 360 },
  { day: 10, revenue: 1680, users: 420 },
  { day: 13, revenue: 1540, users: 400 },
  { day: 16, revenue: 1920, users: 480 },
  { day: 19, revenue: 1780, users: 450 },
  { day: 22, revenue: 2100, users: 520 },
  { day: 25, revenue: 1960, users: 490 },
  { day: 28, revenue: 2340, users: 560 },
  { day: 30, revenue: 2200, users: 540 },
];

export const projects = [
  { name: 'Website Redesign', progress: 72, color: '#2563EB' },
  { name: 'Marketing Campaign', progress: 91, color: '#10B981' },
  { name: 'Automation Setup', progress: 48, color: '#7C3AED' },
];

export const teamMembers = [
  { name: 'Emma', initials: 'EM', status: 'Online', statusColor: '#10B981', gradient: 'linear-gradient(135deg, #EC4899, #F59E0B)' },
  { name: 'Alex', initials: 'AX', status: 'Editing', statusColor: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)' },
  { name: 'Olivia', initials: 'OL', status: 'Reviewing', statusColor: '#F59E0B', gradient: 'linear-gradient(135deg, #7C3AED, #EC4899)' },
  { name: 'Noah', initials: 'NO', status: 'Idle', statusColor: '#64748B', gradient: 'linear-gradient(135deg, #38BDF8, #2563EB)' },
];

export const floatingWidgets = [
  { id: 1, label: '+$8K Revenue', value: '', icon: 'revenue', color: '#2563EB', position: { top: '12%', left: '-8%' } },
  { id: 2, label: '99.9% Uptime', value: '', icon: 'uptime', color: '#10B981', position: { top: '45%', right: '-10%' } },
  { id: 3, label: 'AI Active', value: '', icon: 'ai', color: '#7C3AED', position: { bottom: '15%', left: '5%' } },
];

/* ================================
   ANALYTICS DASHBOARD DATA
   ================================ */

export const analyticsKpiCards = [
  {
    id: 'totalRevenue',
    label: 'Total Revenue',
    value: 1247500,
    prefix: '$',
    suffix: '',
    change: 23.4,
    positive: true,
    gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    sparkline: [42, 38, 45, 41, 48, 44, 52, 49, 55, 51, 58, 54],
    incrementRange: [500, 2000],
  },
  {
    id: 'conversionRate',
    label: 'Conversion Rate',
    value: 23.4,
    prefix: '',
    suffix: '%',
    change: 12.1,
    positive: true,
    gradient: 'linear-gradient(135deg, #10B981, #2563EB)',
    sparkline: [18, 20, 19, 22, 21, 24, 23, 25, 24, 26, 25, 27],
    incrementRange: [0.1, 0.3],
  },
  {
    id: 'avgOrderValue',
    label: 'Avg Order Value',
    value: 156,
    prefix: '$',
    suffix: '',
    change: -3.2,
    positive: false,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    sparkline: [145, 148, 142, 155, 151, 158, 154, 162, 158, 165, 161, 168],
    incrementRange: [0.5, 2],
  },
  {
    id: 'churnRate',
    label: 'Churn Rate',
    value: 2.1,
    prefix: '',
    suffix: '%',
    change: -8.7,
    positive: true,
    gradient: 'linear-gradient(135deg, #EC4899, #F59E0B)',
    sparkline: [4.2, 4.0, 3.8, 3.5, 3.3, 3.0, 2.8, 2.5, 2.4, 2.2, 2.1, 2.0],
    incrementRange: [0.02, 0.08],
  },
];

export const analyticsChartData = [
  { month: 'Jan', revenue: 45000, conversions: 1240, users: 8900 },
  { month: 'Feb', revenue: 52000, conversions: 1380, users: 9400 },
  { month: 'Mar', revenue: 48000, conversions: 1310, users: 9100 },
  { month: 'Apr', revenue: 61000, conversions: 1520, users: 10200 },
  { month: 'May', revenue: 55000, conversions: 1440, users: 9800 },
  { month: 'Jun', revenue: 67000, conversions: 1680, users: 11100 },
  { month: 'Jul', revenue: 72000, conversions: 1790, users: 11800 },
  { month: 'Aug', revenue: 69000, conversions: 1720, users: 11400 },
  { month: 'Sep', revenue: 78000, conversions: 1910, users: 12400 },
  { month: 'Oct', revenue: 85000, conversions: 2040, users: 13100 },
  { month: 'Nov', revenue: 91000, conversions: 2180, users: 13800 },
  { month: 'Dec', revenue: 98000, conversions: 2320, users: 14500 },
];

export const funnelData = [
  { stage: 'Visitors', value: 125000, color: '#2563EB' },
  { stage: 'Signups', value: 42000, color: '#7C3AED' },
  { stage: 'Activations', value: 18500, color: '#10B981' },
  { stage: 'Paid', value: 4200, color: '#F59E0B' },
  { stage: 'Retained', value: 3100, color: '#EC4899' },
];

export const retentionData = [
  { week: 'Week 1', retained: 100 },
  { week: 'Week 2', retained: 68 },
  { week: 'Week 3', retained: 52 },
  { week: 'Week 4', retained: 44 },
  { week: 'Week 5', retained: 38 },
  { week: 'Week 6', retained: 34 },
  { week: 'Week 7', retained: 31 },
  { week: 'Week 8', retained: 29 },
];

export const topPagesData = [
  { page: '/dashboard', views: 45200, bounce: 23.4 },
  { page: '/analytics', views: 32100, bounce: 31.2 },
  { page: '/reports', views: 28400, bounce: 28.7 },
  { page: '/settings', views: 19800, bounce: 42.1 },
  { page: '/integrations', views: 15600, bounce: 35.8 },
];

export const geoData = [
  { country: 'United States', revenue: 485000, users: 12400, color: '#2563EB' },
  { country: 'United Kingdom', revenue: 198000, users: 5200, color: '#7C3AED' },
  { country: 'Germany', revenue: 156000, users: 4100, color: '#10B981' },
  { country: 'France', revenue: 112000, users: 3200, color: '#F59E0B' },
  { country: 'Canada', revenue: 98000, users: 2800, color: '#EC4899' },
];

export const deviceData = [
  { device: 'Desktop', sessions: 65400, conversion: 3.2 },
  { device: 'Mobile', sessions: 42100, conversion: 1.8 },
  { device: 'Tablet', sessions: 8900, conversion: 2.4 },
];

export const analyticsActivityItems = [
  { id: 1, user: 'System', action: 'Revenue spike detected in EU region', time: '3 min ago', color: '#10B981' },
  { id: 2, user: 'AI', action: 'Anomaly: Conversion drop in mobile traffic', time: '8 min ago', color: '#EF4444' },
  { id: 3, user: 'Sarah', action: 'Created new funnel report for Q4', time: '15 min ago', color: '#7C3AED' },
  { id: 4, user: 'AI', action: 'Predictive model updated: +12% accuracy', time: '22 min ago', color: '#2563EB' },
  { id: 5, user: 'Alex', action: 'Exported cohort analysis for board', time: '35 min ago', color: '#EC4899' },
  { id: 6, user: 'System', action: 'Daily cohort analysis completed', time: '48 min ago', color: '#38BDF8' },
  { id: 7, user: 'Emma', action: 'Shared retention dashboard with team', time: '1 hr ago', color: '#EC4899' },
  { id: 8, user: 'Noah', action: 'Configured new alert thresholds', time: '2 hr ago', color: '#8B5CF6' },
];