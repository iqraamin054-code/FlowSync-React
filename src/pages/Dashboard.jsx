import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useScrollReveal from '../hooks/useScrollReveal.js';
import WorkflowWorkspace from '../components/dashboard/WorkflowWorkspace.jsx';
import useWorkflowProject from '../hooks/useWorkflowProject.js';
import useNotifications from '../hooks/useNotifications.js';
import { getProjectProgress } from '../utils/workflowGenerator.js';
import { getActiveEmail, getUser, getWorkspace, setWorkspaceTheme, updateWorkspaceProfile } from '../utils/workspaceStorage.js';
import { TRANSLATIONS } from '../data/translations.js';

const ACCENT_MAP = {
  blue:{primary:'#2563EB',hover:'#1D4ED8',glow:'rgba(37,99,235,0.15)',rgb:'37,99,235'},
  purple:{primary:'#7C3AED',hover:'#6D28D9',glow:'rgba(124,58,237,0.15)',rgb:'124,58,237'},
  green:{primary:'#10B981',hover:'#059669',glow:'rgba(16,185,129,0.15)',rgb:'16,185,129'},
  pink:{primary:'#EC4899',hover:'#DB2777',glow:'rgba(236,72,153,0.15)',rgb:'236,72,153'},
  red:{primary:'#EF4444',hover:'#DC2626',glow:'rgba(239,68,68,0.15)',rgb:'239,68,68'},
};

const LANG_NAMES = { en:'English','en-gb':'English (UK)',de:'Deutsch',fr:'Français',es:'Español',ja:'日本語',zh:'中文',ar:'العربية',ur:'اردو' };

const PHASES = ['Planning', 'Design', 'Development', 'Content', 'Testing', 'Launch'];

function getInitials(name) {
  const p = name.trim().split(/\s+/);
  if (!p.length) return 'FS';
  if (p.length === 1) return p[0].substring(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const fmtDate = (dateStr) => { const d = new Date(dateStr); return `${String(d.getDate()).padStart(2, '0')} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${d.getFullYear()}`; };
  const { project, projects, selectProject, startProject: rawStartProject, updateTask: rawUpdateTask, deleteProject } = useWorkflowProject();
  const { notifications, unreadCount, isOpen: notifOpen, togglePanel: toggleNotifPanel, markAsRead, markAllAsRead, createNotification } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdOpen, setPdOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.theme) return ws.theme;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-theme') === 'light' ? 'light' : 'dark';
  });
  const [lang, setLang] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && ws.profile.language) return ws.profile.language;
        }
        const usersStr = localStorage.getItem('flowsync-users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const user = users[activeEmail.trim().toLowerCase()];
          if (user && user.profile && user.profile.language) return user.profile.language;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-language') || 'en';
  });
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('flowsync-accent') || 'blue';
  });
  const [username, setUsername] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && ws.profile.fullName) return ws.profile.fullName;
        }
        const usersStr = localStorage.getItem('flowsync-users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const user = users[activeEmail.trim().toLowerCase()];
          if (user && user.profile && user.profile.fullName) return user.profile.fullName;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-username') || 'Alex R.';
  });
  const [company, setCompany] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && ws.profile.companyName) return ws.profile.companyName;
        }
        const usersStr = localStorage.getItem('flowsync-users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const user = users[activeEmail.trim().toLowerCase()];
          if (user && user.profile && user.profile.companyName) return user.profile.companyName;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-company') || 'My Workspace';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || 'alex@example.com';
  });
  const [members, setMembers] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && Array.isArray(ws.profile.teamMembers)) {
            return ws.profile.teamMembers.length + 1;
          }
        }
      }
    } catch (e) {}
    const stored = parseInt(localStorage.getItem('flowsync-team-members'), 10);
    return Number.isNaN(stored) || stored < 1 ? 1 : stored;
  });
  const [activeNav, setActiveNav] = useState('dashboard');
  useScrollReveal(activeNav);
  const [modal, setModal] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [industry, setIndustry] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && ws.profile.industry) return ws.profile.industry;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-industry') || 'Technology';
  });
  const [role, setRole] = useState(() => {
    try {
      const activeEmail = localStorage.getItem('flowsync-active-email') || localStorage.getItem('flowsync-email') || '';
      if (activeEmail) {
        const workspaceKey = `flowsync-workspace:${encodeURIComponent(activeEmail.trim().toLowerCase())}`;
        const wsStr = localStorage.getItem(workspaceKey);
        if (wsStr) {
          const ws = JSON.parse(wsStr);
          if (ws && ws.profile && ws.profile.role) return ws.profile.role;
        }
      }
    } catch (e) {}
    return localStorage.getItem('flowsync-role') || 'Team Lead';
  });
  
  // Custom states for Team Tab
  const [teamList, setTeamList] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectRequest, setNewProjectRequest] = useState(0);
  const [creatingNew, setCreatingNew] = useState(false);

  const pdRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') { navigate('/'); return; }
    const activeEmail = getActiveEmail();
    const workspace = getWorkspace(activeEmail);
    const account = getUser(activeEmail);
    const profile = account?.profile || workspace.profile || {};
    const t = workspace.theme === 'light' ? 'light' : '';
    const a = localStorage.getItem('flowsync-accent') || 'blue';
    // Language: workspace profile is authoritative; localStorage is a fast-access cache
    const l = profile.language || localStorage.getItem('flowsync-language') || 'en';
    localStorage.setItem('flowsync-language', l);
    const u = profile.fullName || localStorage.getItem('flowsync-username') || 'Alex R.';
    const c = profile.companyName || localStorage.getItem('flowsync-company') || 'My Workspace';
    const e = activeEmail || 'alex@example.com';
    const onboardedTeam = Array.isArray(profile.teamMembers) ? profile.teamMembers : [];
    const m = onboardedTeam.length + 1;
    const ind = profile.industry || 'Technology';
    const r = profile.role || 'Team Lead';
    const n = localStorage.getItem('flowsync-notif') !== 'false';
    setTheme(t === 'light' ? 'light' : 'dark');
    setAccent(a);
    setLang(l);
    setUsername(u);
    setCompany(c);
    setEmail(e);
    setMembers(m);
    setIndustry(ind);
    setRole(r);
    setNotifEnabled(n);
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : '');
    const ac = ACCENT_MAP[a] || ACCENT_MAP.blue;
    document.documentElement.style.setProperty('--color-primary', ac.primary);
    document.documentElement.style.setProperty('--color-primary-hover', ac.hover);
    document.documentElement.style.setProperty('--shadow-glow-primary', ac.glow);
    document.documentElement.style.setProperty('--color-primary-rgb', ac.rgb);

    const memberColors = ['#7C3AED', '#10B981', '#EC4899', '#F59E0B'];
    setTeamList(onboardedTeam.map((member, index) => ({
      ...member,
      name: member.name || member.email.split('@')[0],
      status: 'Invited',
      color: memberColors[index % memberColors.length],
      bg: `${memberColors[index % memberColors.length]}22`,
    })));
  }, [navigate]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
    localStorage.setItem('flowsync-theme', next === 'light' ? 'light' : '');
    setWorkspaceTheme(next, getActiveEmail());
  };

  const t = (key, interpolations = {}) => {
    let text = (TRANSLATIONS[lang] || TRANSLATIONS.en)[key] || key;
    Object.entries(interpolations).forEach(([k, v]) => {
      text = text.split('{' + k + '}').join(v);
    });
    return text;
  };

  const startProject = useCallback((values) => {
    const newProj = rawStartProject(values);
    createNotification({
      type: 'project_created',
      title: t('projectCreatedTitle'),
      description: t('projectCreatedDesc', { name: values.name || 'Untitled' }),
      projectName: values.name || 'Untitled',
      projectId: newProj?.id,
    });
    return newProj;
  }, [rawStartProject, createNotification, t]);

  const updateTask = useCallback((taskId, updates) => {
    const prevTask = project?.tasks?.find(t => t.id === taskId);
    const projectName = project?.name || '';
    const projectId = project?.id;
    rawUpdateTask(taskId, updates);
    if (updates.status && prevTask && updates.status !== prevTask.status) {
      createNotification({
        type: 'task_status_changed',
        title: t('taskStatusChangedTitle'),
        description: t('taskStatusChangedDesc', { task: prevTask.title, status: updates.status, project: projectName }),
        projectName,
        projectId,
      });
    } else if (updates.status === 'done' && prevTask?.status !== 'done') {
      createNotification({
        type: 'task_completed',
        title: t('taskCompletedTitle'),
        description: t('taskCompletedDesc', { task: prevTask?.title || '', project: projectName }),
        projectName,
        projectId,
      });
    }
  }, [rawUpdateTask, project, createNotification, t]);

  const updateLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('flowsync-language', newLang);
    updateWorkspaceProfile({ language: newLang }, getActiveEmail());
  };
  const searchResults = searchQuery.trim() ? projects.flatMap((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesProject = item.name.toLowerCase().includes(query) || item.goal.toLowerCase().includes(query);
    const matchingTasks = item.tasks.filter((task) => task.title.toLowerCase().includes(query));
    return matchesProject || matchingTasks.length ? [{ project: item, matchingTasks }] : [];
  }) : [];
  const openSearchResult = (projectId) => { selectProject(projectId); setActiveNav('dashboard'); setSearchQuery(''); };

  useEffect(() => {
    if (!pdOpen) return;
    const handler = (e) => { if (pdRef.current && !pdRef.current.contains(e.target)) setPdOpen(false); };
    const keyHandler = (e) => { if (e.key === 'Escape') setPdOpen(false); };
    document.addEventListener('click', handler);
    document.addEventListener('keydown', keyHandler);
    return () => { document.removeEventListener('click', handler); document.removeEventListener('keydown', keyHandler); };
  }, [pdOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => { if (!e.target.closest('.header-btn[aria-label="Notifications"]')) toggleNotifPanel(); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [notifOpen, toggleNotifPanel]);

  useEffect(() => {
    const btn = document.querySelector('.hamburger-btn');
    if (!btn) return;
    const updateHamburger = () => {
      if (window.innerWidth > 900) {
        btn.classList.add('is-hidden');
      } else {
        btn.classList.remove('is-hidden');
      }
    };
    updateHamburger();
    window.addEventListener('resize', updateHamburger);
    return () => window.removeEventListener('resize', updateHamburger);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('is-visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    if (!glow || matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    let raf = null;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Update dynamic chart tooltips
  useEffect(() => {
    const container = document.getElementById('trends-chart-container');
    const tooltip = document.getElementById('chart-tooltip');
    if (!container || !tooltip) return;
    const hotspots = container.querySelectorAll('.chart-hotspot');
    const handlers = [];
    hotspots.forEach((spot) => {
      const enter = () => {
        const cx = parseFloat(spot.getAttribute('cx'));
        const cy = parseFloat(spot.getAttribute('cy'));
        const phaseName = spot.getAttribute('data-phase');
        const pctVal = spot.getAttribute('data-pct');
        
        const dateEl = tooltip.querySelector('.tooltip-header');
        const valEls = tooltip.querySelectorAll('.tooltip-val');
        
        if (dateEl) dateEl.textContent = phaseName;
        if (valEls[0]) valEls[0].textContent = `${pctVal}% Complete`;
        if (valEls[1]) valEls[1].parentElement.style.display = 'none'; // Hide secondary user stat
        
        const wPct = (cx / 600) * 100;
        const hPct = (cy / 320) * 100;
        tooltip.style.left = `calc(${wPct}% - 60px)`;
        tooltip.style.top = `calc(${hPct}% - 90px)`;
        tooltip.classList.add('is-visible');
      };
      const leave = () => tooltip.classList.remove('is-visible');
      spot.addEventListener('mouseenter', enter);
      spot.addEventListener('mouseleave', leave);
      handlers.push([spot, 'mouseenter', enter], [spot, 'mouseleave', leave]);
    });
    return () => handlers.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
  }, [project]);

  useEffect(() => {
    const cards = document.querySelectorAll('.ripple');
    const handlers = [];
    cards.forEach((card) => {
      const onDown = (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--ripple-x', `${x}%`);
        card.style.setProperty('--ripple-y', `${y}%`);
      };
      card.addEventListener('mousedown', onDown);
      handlers.push([card, 'mousedown', onDown]);
    });
    return () => handlers.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
  }, [project, activeNav]);

  const logout = () => {
    ['isLoggedIn','flowsync-active-email','flowsync-username','flowsync-email','flowsync-company','flowsync-industry','flowsync-role','flowsync-team-members','flowsync-notif','flowsync-theme','flowsync-language','flowsync-accent'].forEach(k => localStorage.removeItem(k));
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-primary-hover');
    document.documentElement.style.removeProperty('--shadow-glow-primary');
    document.documentElement.style.removeProperty('--color-primary-rgb');
    navigate('/');
  };

  useEffect(() => {
    if (!modal) return;
    const handler = (e) => { if (e.key === 'Escape') setModal(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modal]);

  // Inviting members in Team tab
  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    const initials = newMemberEmail.split('@')[0].substring(0, 2).toUpperCase();
    const newTeammate = {
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: newMemberRole.charAt(0).toUpperCase() + newMemberRole.slice(1),
      status: 'Online',
      bg: 'rgba(124,58,237,0.15)',
      color: '#7C3AED'
    };
    const updatedList = [...teamList, newTeammate];
    setTeamList(updatedList);
    updateWorkspaceProfile({ teamMembers: updatedList.map(({ email: memberEmail, role: memberRole, name }) => ({ email: memberEmail, role: memberRole, name })) });
    setMembers(updatedList.length + 1);
    localStorage.setItem('flowsync-team-members', updatedList.length + 1);
    setNewMemberEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  // Activity feed logic: mixes real checklist actions with dynamic mock comments
  const getActivityFeed = () => {
    const list = [];
    if (project) {
      const completedTasks = project.tasks.filter(t => t.status === 'done');
      completedTasks.slice(-2).forEach((t, i) => {
        list.push({
          initials: getInitials(username),
          bg: 'rgba(37,99,235,0.15)',
          color: 'var(--color-primary)',
          author: username,
          text: `completed task "${t.title}" in ${t.phase}`,
          time: i === 0 ? '5m ago' : '15m ago'
        });
      });
      const ipTasks = project.tasks.filter(t => t.status === 'in-progress');
      ipTasks.slice(-1).forEach(t => {
        list.push({
          initials: getInitials(username),
          bg: 'rgba(37,99,235,0.15)',
          color: 'var(--color-primary)',
          author: username,
          text: `started work on "${t.title}"`,
          time: 'Just now'
        });
      });
    }
    list.push({
      initials: 'EM',
      bg: 'rgba(236,72,153,0.15)',
      color: '#EC4899',
      author: 'Emma',
      text: 'joined workspace channel',
      time: '1h ago'
    });
    list.push({
      initials: 'AX',
      bg: 'rgba(16,185,129,0.15)',
      color: '#10B981',
      author: 'Alex',
      text: 'synced Google Drive integrations',
      time: '2h ago'
    });
    return list.slice(0, 4);
  };

  // Real Project Calculations
  const totalTasks = projects.reduce((sum, item) => sum + item.tasks.length, 0);
  const totalCompleted = projects.reduce((sum, item) => sum + item.tasks.filter((task) => task.status === 'done').length, 0);
  const totalInProgress = projects.reduce((sum, item) => sum + item.tasks.filter((task) => task.status === 'in-progress').length, 0);
  const workspaceProgress = totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const needsAttention = projects.filter(p => getProjectProgress(p.tasks) === 0).length;
  const distBuckets = projects.reduce((acc, p) => {
    const pct = getProjectProgress(p.tasks);
    if (pct <= 25) acc['0-25']++;
    else if (pct <= 50) acc['26-50']++;
    else if (pct <= 75) acc['51-75']++;
    else acc['76-100']++;
    return acc;
  }, { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 });
  const distMax = Math.max(...Object.values(distBuckets), 1);

  const recentProjects = [...projects].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  }).slice(0, 3);

  const chartData = [
    { name: '0–25%', count: distBuckets['0-25'], color: '#EF4444' },
    { name: '26–50%', count: distBuckets['26-50'], color: '#F59E0B' },
    { name: '51–75%', count: distBuckets['51-75'], color: '#3B82F6' },
    { name: '76–100%', count: distBuckets['76-100'], color: '#10B981' },
  ];

  // Chart coordinates calculation (Phase Completion Progress)
  const xCoords = [50, 154, 258, 362, 466, 570];
  const yCoords = PHASES.map((phase) => {
    if (!project) return 270;
    const phaseTasks = project.tasks.filter(t => t.phase === phase);
    if (!phaseTasks.length) return 270;
    const doneCount = phaseTasks.filter(t => t.status === 'done').length;
    const pct = doneCount / phaseTasks.length;
    return 270 - Math.round(pct * 200); // 200px vertical range (70 to 270)
  });

  const pathD = `M 50 ${yCoords[0]} ` + 
                `Q 102 ${yCoords[0] + (yCoords[1] - yCoords[0])/2} 154 ${yCoords[1]} ` +
                `Q 206 ${yCoords[1] + (yCoords[2] - yCoords[1])/2} 258 ${yCoords[2]} ` +
                `Q 310 ${yCoords[2] + (yCoords[3] - yCoords[2])/2} 362 ${yCoords[3]} ` +
                `Q 414 ${yCoords[3] + (yCoords[4] - yCoords[3])/2} 466 ${yCoords[4]} ` +
                `Q 518 ${yCoords[4] + (yCoords[5] - yCoords[4])/2} 570 ${yCoords[5]}`;
                
  const fillD = `${pathD} L 570 270 L 50 270 Z`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const sidebarVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      <div className="db-bg" aria-hidden="true">
        <div className="db-bg__orb db-bg__orb--1"></div>
        <div className="db-bg__orb db-bg__orb--2"></div>
        <div className="db-bg__grid"></div>
      </div>

      <div className={`sidebar-overlay${sidebarOpen ? ' is-visible' : ''}`} onClick={() => setSidebarOpen(false)} aria-hidden="true"></div>

      <motion.div 
        className="db-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.aside 
          className={`db-sidebar${sidebarOpen ? ' is-open' : ''}`} 
          aria-label="Sidebar navigation"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="sidebar-header">
            <Link to="/" className="db-logo" aria-label="FlowSync Home">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#dbLogoGrad)" />
                <path d="M9 14L13 10L19 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 9V19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <defs><linearGradient id="dbLogoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="var(--color-primary, #2563EB)" /><stop offset="1" stopColor="var(--color-secondary, #7C3AED)" /></linearGradient></defs>
              </svg>
              <span className="db-logo__text">FlowSync</span>
            </Link>
            <button className="sidebar-close-btn" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="sidebar-profile" ref={pdRef} onClick={(e) => { if (!e.target.closest('.pd')) setPdOpen(!pdOpen); }} style={{ position:'relative', cursor:'pointer' }}>
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{getInitials(username)}</div>
              <span className="status-indicator active" aria-label="Active status"></span>
            </div>
            <div className="profile-info">
              <span className="profile-name">{username}</span>
              <span className="profile-status">{t('active')}</span>
            </div>
            <div className="profile-alert-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="alert-dot"></span>
            </div>

            {pdOpen && (
              <div className="pd is-open" role="menu" aria-label="User menu" onClick={e => e.stopPropagation()}>
                <div className="pd-header">
                  <div className="pd-avatar-wrap"><div className="pd-avatar">{getInitials(username)}</div><span className="pd-dot" aria-label="Online"></span></div>
                  <div className="pd-info"><span className="pd-name">{username}</span><span className="pd-email">{email}</span><span className="pd-status">{t('onlineStatus')}</span></div>
                </div>
                <div className="pd-divider"></div>
                <div className="pd-body">
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('profile'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>{t('profileHeader')}</span></button>
                  <button className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('appearance'); }}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg><span>{t('appearanceHeader')}</span></div><span className="pd-hint">{theme === 'light' ? t('lightMode') : t('darkMode')}</span></button>
                  <button className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('language'); }}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>{t('languageHeader')}</span></div><span className="pd-hint">{LANG_NAMES[lang] || 'English'}</span></button>
                  <div className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span>{t('notifications')}</span></div><label className="pd-toggle" aria-label={t('notifications')}><input type="checkbox" checked={notifEnabled} onChange={(e) => { setNotifEnabled(e.target.checked); localStorage.setItem('flowsync-notif', e.target.checked); }} /><span className="pd-toggle-track"></span></label></div>
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setActiveNav('settings'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>{t('settings')}</span></button>
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('help'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>{t('helpHeader')}</span></button>
                </div>
                <div className="pd-divider"></div>
                <div className="pd-footer">
                  <button className="pd-item pd-item--danger" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('logout'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>{t('logoutHeader')}</span></button>
                </div>
              </div>
            )}
          </div>

          <nav className="sidebar-nav" aria-label="Main menu">
            <ul className="nav-list">
              {[
                { id: 'dashboard', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>, key: 'dashboard' },
                { id: 'projects', icon: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>, key: 'projects' },
                { id: 'team', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, key: 'team' },
                { id: 'settings', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>, key: 'settings' }
              ].map(item => (
                <li key={item.id} className="nav-item">
                  <a href="#" className={`nav-link${activeNav === item.id ? ' nav-link--active' : ''}`} onClick={e => { e.preventDefault(); setActiveNav(item.id); }}>
                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                    <span className="nav-text">{t(item.key)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-profile sidebar-profile--mini">
              <div className="profile-avatar-wrap"><div className="profile-avatar">{getInitials(username)}</div><span className="status-indicator active"></span></div>
              <div className="profile-info"><span className="profile-name">{username}</span><span className="profile-status">{t('active')}</span></div>
            </div>
          </div>
        </motion.aside>

        <main className="db-main" role="main" aria-label="Workspace dashboard">
          <header className="db-header">
            <button className="hamburger-btn" aria-label="Open sidebar" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="db-header-title">{t(activeNav)}</span>
            <div className="header-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
              {searchQuery.trim() && <div className="workspace-search-results" role="listbox" aria-label={t('searchPlaceholder')}>
                {searchResults.length ? searchResults.map(({ project: result, matchingTasks }) => <button type="button" key={result.id} className="workspace-search-result" onClick={() => openSearchResult(result.id)}><strong>{result.name}</strong><span>{matchingTasks.length ? `${matchingTasks.length} ${matchingTasks.length === 1 ? t('matchingTask') : t('matchingTasks')}` : result.goal}</span></button>) : <span className="workspace-search-empty">{t('noSearchResults')} "{searchQuery}".</span>}
              </div>}
            </div>
            <div className="header-actions">
              <button className="header-btn" aria-label={t('notifications')} onClick={(e) => { e.stopPropagation(); toggleNotifPanel(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && <span className="badge badge--danger">{unreadCount}</span>}
                {notifOpen && (
                  <div className="notifications-dropdown" onClick={e => e.stopPropagation()}>
                    <div className="notif-header">
                      <span>{t('notifications')}</span>
                      {unreadCount > 0 && <button className="notif-mark-all" onClick={markAllAsRead}>{t('markAllRead')}</button>}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="notif-empty">{t('noNotifications')}</div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div key={notif.id} className={`notif-item ${notif.read ? 'notif-item--read' : ''}`} onClick={() => markAsRead(notif.id)}>
                          <span className={`notif-dot ${notif.read ? 'notif-dot--read' : ''}`}></span>
                          <div className="notif-content">
                            <div className="notif-title">{notif.title}</div>
                            <div className="notif-desc">{notif.description}</div>
                            <div className="notif-time">{new Date(notif.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </button>
              <button className="header-date"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span></button>
              <div className="header-dropdown-wrap lang-dropdown-wrap">
                <svg className="lang-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <select className="header-dropdown" value={lang} onChange={e => updateLanguage(e.target.value)} aria-label="Language selector">
                  {Object.keys(LANG_NAMES).map(k => <option key={k} value={k}>{LANG_NAMES[k]}</option>)}
                </select>
              </div>
              <button className="db-theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>
                <svg className="db-theme-icon db-theme-icon--sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                <svg className="db-theme-icon db-theme-icon--moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              </button>
            </div>
          </header>

          <div className="db-content" style={{ position: 'relative' }}>
            
            {activeNav === 'dashboard' && (
              <>
                {/* Case 1: No projects at all — show new-user workspace (create form) */}
                {projects.length === 0 ? (
                  <WorkflowWorkspace
                    lang={lang}
                    industry={industry}
                    createRequest={creatingNew ? 1 : newProjectRequest}
                    onCreateRequestHandled={() => { setNewProjectRequest(0); setCreatingNew(false); }}
                    project={project}
                    startProject={(vals) => { startProject(vals); setCreatingNew(false); }}
                    updateTask={updateTask}
                    deleteProject={deleteProject}
                    onCancel={() => setCreatingNew(false)}
                  />
                ) : creatingNew ? (
                  /* Case 2: User clicked "Create New Project" — show creation form */
                  <WorkflowWorkspace
                    lang={lang}
                    industry={industry}
                    createRequest={1}
                    onCreateRequestHandled={() => {}}
                    project={null}
                    startProject={(vals) => { startProject(vals); setCreatingNew(false); }}
                    updateTask={updateTask}
                    deleteProject={deleteProject}
                    onCancel={() => setCreatingNew(false)}
                  />
                ) : project ? (
                  /* Case 3: A project is actively selected — show its workspace */
                  <WorkflowWorkspace
                    lang={lang}
                    createRequest={newProjectRequest}
                    onCreateRequestHandled={() => setNewProjectRequest(0)}
                    project={project}
                    startProject={startProject}
                    updateTask={updateTask}
                    deleteProject={deleteProject}
                    onBack={() => selectProject(null)}
                  />
                ) : (
                  /* Case 4: Returning user — project overview dashboard */
                  <>
                    {/* 1. Personalized Welcome Header */}
                    <div className="db-welcome-section" style={{ marginBottom: '1.75rem' }}>
                      <div className="db-title-row" style={{ marginBottom: '0.35rem' }}>
                        <h2 className="db-title" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
                          {t('welcomeBack', { name: username })}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="db-badge-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg><span>{t('global')}</span></div>
                          <button className="workflow-primary ripple" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCreatingNew(true)}>
                            + {t('createNewProjectBtn').replace('+ ', '')}
                          </button>
                        </div>
                      </div>
                      <p className="db-welcome-subtext" style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.95rem', margin: 0 }}>
                        {t('welcomeSubtext')}
                      </p>
                    </div>

                    {/* Overview Stats Row */}
                    <div className="db-overview-stats">
                      <div className="db-stat-card glass-card ripple">
                        <div className="db-stat-icon" style={{ background: 'rgba(37,99,235,0.12)', color: '#3B82F6' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        </div>
                        <div className="db-stat-body">
                          <span className="db-stat-value">{projects.length}</span>
                          <span className="db-stat-label">{t('activeWorkspaces')}</span>
                        </div>
                      </div>
                      <div className="db-stat-card glass-card ripple">
                        <div className="db-stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <div className="db-stat-body">
                          <span className="db-stat-value">{workspaceProgress}%</span>
                          <span className="db-stat-label">{t('overallProgress')}</span>
                        </div>
                      </div>
                      <div className="db-stat-card glass-card ripple">
                        <div className="db-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div className="db-stat-body">
                          <span className="db-stat-value">{totalCompleted}/{totalTasks}</span>
                          <span className="db-stat-label">{t('completedTasksCard')}</span>
                        </div>
                      </div>
                      <div className="db-stat-card glass-card ripple">
                        <div className="db-stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div className="db-stat-body">
                          <span className="db-stat-value">{needsAttention}</span>
                          <span className="db-stat-label">{t('needsAttention')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Distribution Donut Chart */}
                    <div className="db-distribution-chart glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                      <div className="db-dist-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="db-dist-title" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('progressDistribution')}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{projects.length} {t('activeWorkspaces')}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem' }}>
                        <div style={{ width: '100%', maxWidth: '240px', height: '200px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="count"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  background: '#1E293B', 
                                  border: '1px solid rgba(255,255,255,0.1)', 
                                  borderRadius: '8px',
                                  color: '#F8FAFC',
                                  fontSize: '0.85rem',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                                }}
                                formatter={(value, name) => [`${value} workspace${value !== 1 ? 's' : ''}`, `Range ${name}`]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Chart Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '180px' }}>
                          {chartData.map((item) => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                  {item.name} {t('progressSuffix')}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {item.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Condensed Recent Workspaces Preview */}
                    <div className="db-recent-workspaces-section glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {t('recentWorkspaces')}
                          </h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {t('recentWorkspacesDesc')}
                          </span>
                        </div>
                        <button 
                          className="workflow-secondary ripple"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => setActiveNav('projects')}
                        >
                          <span>{t('viewAllProjects')}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      </div>

                      {projects.length === 0 ? (
                        <div className="db-workspace-empty" style={{ padding: '1.5rem', textAlign: 'center' }}>
                          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('noProjectsText')}</p>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                          {recentProjects.map((proj, idx) => {
                            const pct = getProjectProgress(proj.tasks);
                            const colors = ['#2563EB', '#7C3AED', '#10B981', '#EC4899', '#F59E0B'];
                            const color = colors[idx % colors.length];
                            return (
                              <div 
                                key={proj.id}
                                onClick={() => selectProject(proj.id)}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                                  borderRadius: '10px',
                                  padding: '1rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.75rem'
                                }}
                                className="recent-ws-item ripple"
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {proj.name}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color, flexShrink: 0 }}>
                                    {pct}%
                                  </span>
                                </div>
                                
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {activeNav === 'projects' && (
              <div className="projects-tab-view glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2>{t('manageProjects')}</h2>
                  {projects.length > 0 && (
                    <button className="workflow-primary ripple" onClick={() => { setActiveNav('dashboard'); setCreatingNew(true); }}>
                      {t('createNewProjectBtn')}
                    </button>
                  )}
                </div>
                {projects.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '400px', padding: '2rem 1rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t('createFirstProjectTitle')}</p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('createFirstProjectDesc')}</p>
                    <button className="workflow-primary ripple" style={{ padding: '0.7rem 1.8rem', fontSize: '1rem', display: 'inline-block' }} onClick={() => { setActiveNav('dashboard'); setCreatingNew(true); }}>
                      {t('createProjectCTA')}
                    </button>
                  </div>
                ) : (
                  <div className="projects-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {projects.map((proj) => {
                      const pct = getProjectProgress(proj.tasks);
                      const doneTasks = proj.tasks.filter(t => t.status === 'done').length;
                      return (
                        <div key={proj.id} className="project-detail-card glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{proj.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px', marginBottom: '.65rem' }}>{proj.goal}</p>
                          <p className="project-last-updated">{t('lastUpdated')} {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          {proj.targetDate && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '.65rem' }}>
                              {t('targetDateLabel')}: {fmtDate(proj.targetDate)}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <span>{doneTasks} / {proj.tasks.length} {t('completedTasksCard')}</span>
                            <span>{pct}%</span>
                          </div>
                          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary, #2563EB), #7C3AED)' }} />
                          </div>
                          <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button 
                              className="workflow-primary ripple" 
                              style={{ flex: 1, padding: '0.5rem' }} 
                              onClick={() => { selectProject(proj.id); setActiveNav('dashboard'); }}
                            >
                              {t('openWorkspace')}
                            </button>
                            <button 
                              className="workflow-secondary ripple" 
                              style={{ padding: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444' }} 
                              onClick={() => { if (confirm(t('deleteProjectTitle'))) deleteProject(proj.id); }}
                            >
                              {t('deleteBtn')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeNav === 'team' && (
              <div className="team-tab-view glass-card" style={{ padding: '2rem' }}>
                <h2>{t('teamTitle')}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  {t('teamDesc')}
                </p>

                <div className="team-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                  <div className="members-list-container">
                    <h3>{t('teammatesHeader')} ({teamList.length + 1})</h3>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                      {/* You (the user) */}
                      <div className="member-row glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="feed-avatar" style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: 'var(--color-primary)' }}>{getInitials(username)}</div>
                          <div>
                            <h4 style={{ margin: 0 }}>{username} {t('youOwner')}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{email}</span>
                          </div>
                        </div>
                        <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {role} ({t('ownerTag')})
                        </span>
                      </div>

                      {/* Invited Teammates */}
                      {teamList.map((m, idx) => (
                        <div key={idx} className="member-row glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="feed-avatar" style={{ backgroundColor: m.bg || 'rgba(255,255,255,0.05)', color: m.color || '#fff' }}>{getInitials(m.name)}</div>
                            <div>
                              <h4 style={{ margin: 0 }}>{m.name}</h4>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.email}</span>
                            </div>
                          </div>
                          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="invite-member-card glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', height: 'fit-content' }}>
                    <h3>{t('inviteHeader')}</h3>
                    {inviteSuccess && (
                      <div className="alert-success" style={{ color: '#10B981', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                        {t('inviteSuccessMsg')}
                      </div>
                    )}
                    <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {t('emailLabel')}
                          <input 
                            type="email" 
                            required
                            placeholder="teammate@company.com" 
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="ob-input"
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginTop: '0.4rem' }}
                          />
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {t('roleLabel')}
                          <select 
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            className="ob-input"
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', marginTop: '0.4rem' }}
                          >
                            <option value="member">{t('roleMember')}</option>
                            <option value="admin">{t('roleAdmin')}</option>
                            <option value="viewer">{t('roleViewer')}</option>
                          </select>
                        </label>
                      </div>
                      <button type="submit" className="workflow-primary ripple" style={{ width: '100%', padding: '0.6rem', marginTop: '0.5rem' }}>
                        {t('sendInviteBtn')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'settings' && (
              <div className="settings-tab-view">
                <div className="settings-header" style={{ marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t('settingsTitle')}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                    {t('settingsDesc')}
                  </p>
                </div>

                <div className="settings-grid">
                  {/* Left Column */}
                  <div className="settings-column">
                    <div className="settings-section glass-card">
                      <h3 className="settings-section-title">{t('workspaceDetails')}</h3>
                      <div className="settings-fields">
                        <label className="settings-label">
                          {t('companyNameLabel')}
                          <input 
                            type="text" 
                            value={company} 
                            onChange={(e) => { setCompany(e.target.value); localStorage.setItem('flowsync-company', e.target.value); }}
                            className="ob-input settings-input"
                          />
                        </label>
                        <label className="settings-label">
                          {t('industryLabel')}
                          <input 
                            type="text" 
                            value={industry} 
                            disabled
                            className="ob-input settings-input settings-input--disabled"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="settings-section glass-card">
                      <h3 className="settings-section-title">{t('languageHeader')}</h3>
                      <div className="settings-fields">
                        <label className="settings-label">
                          {t('languageSelection')}
                          <select 
                            value={lang} 
                            onChange={(e) => updateLanguage(e.target.value)}
                            className="ob-input settings-input"
                          >
                            <option value="en">English (US)</option>
                            <option value="en-gb">English (UK)</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                            <option value="ar">العربية</option>
                            <option value="ur">اردو</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="settings-column">
                    <div className="settings-section glass-card">
                      <h3 className="settings-section-title">{t('appearanceHeader')}</h3>
                      <div className="settings-fields">
                        <div className="settings-row">
                          <span className="settings-label-text">{t('themeSelection')}</span>
                          <button className="workflow-secondary ripple settings-toggle" onClick={toggleTheme}>
                            {theme === 'light' ? t('lightModeLabel') : t('darkModeLabel')}
                          </button>
                        </div>
                        
                        <div className="settings-label">
                          <span className="settings-label-text">{t('accentColor')}</span>
                          <div className="settings-accent-grid">
                            {Object.keys(ACCENT_MAP).map((cKey) => (
                              <button 
                                key={cKey} 
                                onClick={() => {
                                  setAccent(cKey);
                                  localStorage.setItem('flowsync-accent', cKey);
                                  const ac = ACCENT_MAP[cKey];
                                  document.documentElement.style.setProperty('--color-primary', ac.primary);
                                  document.documentElement.style.setProperty('--color-primary-hover', ac.hover);
                                  document.documentElement.style.setProperty('--shadow-glow-primary', ac.glow);
                                  document.documentElement.style.setProperty('--color-primary-rgb', ac.rgb);
                                }}
                                className={`settings-accent-swatch ${accent === cKey ? 'settings-accent-swatch--active' : ''}`}
                                style={{ background: ACCENT_MAP[cKey].primary }}
                                title={cKey}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section glass-card">
                      <h3 className="settings-section-title">{t('accountSection')}</h3>
                      <div className="settings-fields">
                        <div className="settings-account-field">
                          <span className="settings-account-label">{t('fullNameLabel')}</span>
                          <span className="settings-account-value">{username || t('notSet')}</span>
                        </div>
                        <div className="settings-account-field">
                          <span className="settings-account-label">{t('registeredEmail')}</span>
                          <span className="settings-account-value">{email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </motion.div>

      <div className="cursor-glow" id="cursor-glow" aria-hidden="true"></div>
      <button className="back-to-top" id="back-to-top" aria-label="Back to top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
      </button>

      {modal && (
        <div className="pd-overlay is-open" onClick={() => setModal(null)}>
          <div className="pd-modal" role="dialog" onClick={e => e.stopPropagation()}>
            <div className="pd-modal-header"><span className="pd-modal-title">{modal === 'profile' ? t('profileHeader') : modal === 'appearance' ? t('appearanceHeader') : modal === 'language' ? t('languageHeader') : modal === 'help' ? t('helpHeader') : t('logoutHeader')}</span><button className="pd-modal-close" aria-label="Close" onClick={() => setModal(null)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            {modal === 'profile' && (<>
              <div className="pd-field"><span className="pd-field-label">{t('fullNameLabel')}</span><span className="pd-field-value">{username}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('emailLabelField')}</span><span className="pd-field-value">{email}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('companyLabelField')}</span><span className="pd-field-value">{company}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('industryLabel')}</span><span className="pd-field-value">{industry}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('teamSizeLabel')}</span><span className="pd-field-value">{members} {t('membersSuffix')}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('roleLabel')}</span><span className="pd-field-value">{role}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('themeLabel')}</span><span className="pd-field-value">{theme === 'light' ? t('lightMode') : t('darkMode')}</span></div>
              <div className="pd-field"><span className="pd-field-label">{t('languageLabel')}</span><span className="pd-field-value">{LANG_NAMES[lang] || 'English'}</span></div>
            </>)}
            {modal === 'appearance' && (<div className="pd-theme-options">
              {[{v:'light',icon:<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,label:t('lightMode')},{v:'dark',icon:<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,label:t('darkMode')},{v:'system',icon:<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,label:t('systemMode')}].map(o => (
                <label key={o.v} className={`pd-theme-opt${theme === o.v ? ' is-active' : ''}`} onClick={() => { const resolved = o.v === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : o.v; setTheme(resolved); document.documentElement.setAttribute('data-theme', resolved === 'light' ? 'light' : ''); setWorkspaceTheme(resolved, getActiveEmail()); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{o.icon}</svg><span>{o.label}</span><span className="pd-theme-opt-indicator"></span>
                </label>
              ))}
            </div>)}
            {modal === 'language' && (<div className="pd-lang-options">
              {Object.entries(LANG_NAMES).map(([code, label]) => (
                <label key={code} className={`pd-lang-opt${lang === code ? ' is-active' : ''}`} onClick={() => { updateLanguage(code); }}>
                  <span>{label}</span><span className="pd-lang-opt-check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                </label>
              ))}
            </div>)}
            {modal === 'help' && (<div className="pd-help-content"><p className="pd-help-text">{t('helpText')}</p><div className="pd-help-links"><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{t('helpDoc')}</a><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{t('helpSupport')}</a><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>{t('helpPrivacy')}</a></div></div>)}
            {modal === 'logout' && (<div className="pd-confirm"><div className="pd-confirm-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><div className="pd-confirm-title">{t('logoutConfirmTitle')}</div><p className="pd-confirm-msg">{t('logoutConfirmMsg')}</p><div className="pd-confirm-actions"><button className="pd-confirm-cancel" onClick={() => setModal(null)}>{t('cancelBtn')}</button><button className="pd-confirm-logout" onClick={logout}>{t('logoutBtn')}</button></div></div>)}
          </div>
        </div>
      )}
    </>
  );
}
