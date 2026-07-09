/* ================================
   FLOWSYNC — Dashboard Mock Data
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
