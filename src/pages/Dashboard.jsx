import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal.js';
import WorkflowWorkspace from '../components/dashboard/WorkflowWorkspace.jsx';
import useWorkflowProject from '../hooks/useWorkflowProject.js';
import { getProjectProgress } from '../utils/workflowGenerator.js';
import { getActiveEmail, getUser, getWorkspace, setWorkspaceTheme, updateWorkspaceProfile } from '../utils/workspaceStorage.js';

const TRANSLATIONS = {
  en: { dashboard:'Dashboard',analytics:'Analytics',projects:'Projects',team:'Team',messages:'Messages',settings:'Settings',active:'active',activeUsers:'Active Users',monthlyRevenue:'Monthly Revenue',conversionRate:'Conversion Rate',growth:'Growth',growthTrends:'Phase Completion Progress',projectStatus:'Project Status',ongoingCount:'ongoing projects',activityFeed:'Team Activity Feed',global:'Global',act1:'completed UK Sync',act2:'pushed code to main now',act3:'created report' },
  de: { dashboard:'Übersicht',analytics:'Analysen',projects:'Projekte',team:'Team',messages:'Nachrichten',settings:'Einstellungen',active:'aktiv',activeUsers:'Aktive Benutzer',monthlyRevenue:'Monatlicher Umsatz',conversionRate:'Konversionsrate',growth:'Wachstum',growthTrends:'Phasenfortschritt',projectStatus:'Projektstatus',ongoingCount:'laufende Projekte',activityFeed:'Aktivitäts-Feed',global:'Global',act1:'hat UK-Sync abgeschlossen',act2:'hat Code in Main gepusht',act3:'hat Bericht erstellt' },
  fr: { dashboard:'Tableau de Bord',analytics:'Analyses',projects:'Projets',team:'Équipe',messages:'Messages',settings:'Paramètres',active:'actif',activeUsers:'Utilisateurs Actifs',monthlyRevenue:'Revenu Mensuel',conversionRate:'Taux de Conversion',growth:'Croissance',growthTrends:'Progrès des Phases',projectStatus:'Statut des Projets',ongoingCount:'projets en cours',activityFeed:"Flux d'Activité",global:'Global',act1:'a terminé la synchro UK',act2:'a déployé le code sur main',act3:'a créé un rapport' },
  es: { dashboard:'Tablero',analytics:'Analítica',projects:'Proyectos',team:'Equipo',messages:'Mensajes',settings:'Ajustes',active:'activo',activeUsers:'Usuarios Activos',monthlyRevenue:'Ingresos Mensuales',conversionRate:'Tasa de Conversión',growth:'Crecimiento',growthTrends:'Progreso de Fases',projectStatus:'Estado de Proyectos',ongoingCount:'proyectos en curso',activityFeed:'Feed de Actividad',global:'Global',act1:'completó la sincronización UK',act2:'subió código a main ahora',act3:'creó un reporte' },
  ja: { dashboard:'ダッシュボード',analytics:'分析',projects:'プロジェクト',team:'チーム',messages:'メッセージ',settings:'設定',active:'アクティブ',activeUsers:'アクティブユーザー',monthlyRevenue:'月次収益',conversionRate:'コンバージョン率',growth:'成長率',growthTrends:'フェーズの進行状況',projectStatus:'プロジェクト状況',ongoingCount:'進行中プロジェクト',activityFeed:'チーム活動フィード',global:'グローバル',act1:'がUK同期を完了しました',act2:'がコードをメインに反映しました',act3:'がレポートを作成しました' },
  zh: { dashboard:'仪表板',analytics:'数据分析',projects:'项目',team:'团队',messages:'消息',settings:'设置',active:'在线',activeUsers:'活跃用户',monthlyRevenue:'月收入',conversionRate:'转化率',growth:'增长率',growthTrends:'阶段完成度',projectStatus:'项目状态',ongoingCount:'进行中的项目',activityFeed:'团队动态列表',global:'全局',act1:'完成了英国节点同步',act2:'刚刚推送代码到主分支',act3:'创建了新报告' },
  ar: { dashboard:'لوحة التحكم',analytics:'التحليلات',projects:'المشاريع',team:'الفريق',messages:'الرسائل',settings:'الإعدادات',active:'نشط',activeUsers:'المستخدمين النشطين',monthlyRevenue:'الإيرادات الشهرية',conversionRate:'معدل التحويل',growth:'النمو',growthTrends:'تقدم مراحل المشروع',projectStatus:'حالة المشاريع',ongoingCount:'مشاريع مستمرة',activityFeed:'آخر نشاط للفريق',global:'عالمي',act1:'أكمل مزامنة المملكة المتحدة',act2:'قام برفع الكود إلى الفرع الرئيسي',act3:'أنشأ تقريرًا جديدًا' },
  ur: { dashboard:'ڈیش بورڈ',analytics:'تجزیات',projects:'پروجیکٹس',team:'ٹیم',messages:'پیغامات',settings:'ترتیبات',active:'آن لائن',activeUsers:'فعال صارفین',monthlyRevenue:'ماہانہ آمدنی',conversionRate:'کنورژن ریٹ',growth:'ترقی',growthTrends:'مراحل کی تکمیل',projectStatus:'منصوبوں کی صورتحال',ongoingCount:'جاری منصوبے',activityFeed:'ٹیم کی سرگرمیاں',global:'عالمی',act1:'نے یوکے سنک مکمل کر لیا',act2:'نے کوڈ مین برانچ میں پش کر دیا',act3:'نے نئی رپورٹ تیار کی' },
  'en-gb': { dashboard:'Dashboard',analytics:'Analytics',projects:'Projects',team:'Team',messages:'Messages',settings:'Settings',active:'active',activeUsers:'Active Users',monthlyRevenue:'Monthly Revenue',conversionRate:'Conversion Rate',growth:'Growth',growthTrends:'Phase Completion Progress',projectStatus:'Project Status',ongoingCount:'ongoing projects',activityFeed:'Team Activity Feed',global:'Global',act1:'completed UK Sync',act2:'pushed code to main now',act3:'created report' },
};

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
  useScrollReveal();
  const { project, projects, selectProject, deleteProject } = useWorkflowProject();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdOpen, setPdOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [accent, setAccent] = useState('blue');
  const [username, setUsername] = useState('Alex R.');
  const [company, setCompany] = useState('Synergy Analytics');
  const [email, setEmail] = useState('alex@example.com');
  const [members, setMembers] = useState(1);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [industry, setIndustry] = useState('Technology');
  const [role, setRole] = useState('Team Lead');
  
  // Custom states for Team Tab
  const [teamList, setTeamList] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectRequest, setNewProjectRequest] = useState(0);

  const pdRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') { navigate('/'); return; }
    const activeEmail = getActiveEmail();
    const workspace = getWorkspace(activeEmail);
    const account = getUser(activeEmail);
    const profile = account?.profile || workspace.profile || {};
    const t = workspace.theme === 'light' ? 'light' : '';
    const a = localStorage.getItem('flowsync-accent') || 'blue';
    const l = localStorage.getItem('flowsync-language') || 'en';
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

  const t = (key) => (TRANSLATIONS[lang] || TRANSLATIONS.en)[key] || key;
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
    const handler = (e) => { if (!e.target.closest('.header-btn[aria-label="Notifications"]')) setNotifOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [notifOpen]);

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
    ['isLoggedIn','flowsync-active-email','flowsync-username','flowsync-email','flowsync-company','flowsync-industry','flowsync-role','flowsync-team-members','flowsync-notif'].forEach(k => localStorage.removeItem(k));
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
                  <div className="pd-info"><span className="pd-name">{username}</span><span className="pd-email">{email}</span><span className="pd-status">Online</span></div>
                </div>
                <div className="pd-divider"></div>
                <div className="pd-body">
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('profile'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Profile</span></button>
                  <button className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('appearance'); }}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg><span>Appearance</span></div><span className="pd-hint">{theme === 'light' ? 'Light' : 'Dark'}</span></button>
                  <button className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('language'); }}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>Language</span></div><span className="pd-hint">{LANG_NAMES[lang] || 'English'}</span></button>
                  <div className="pd-item pd-item--between" role="menuitem" tabIndex={pdOpen ? 0 : -1}><div className="pd-item-left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span>Notifications</span></div><label className="pd-toggle" aria-label="Toggle notifications"><input type="checkbox" checked={notifEnabled} onChange={(e) => { setNotifEnabled(e.target.checked); localStorage.setItem('flowsync-notif', e.target.checked); }} /><span className="pd-toggle-track"></span></label></div>
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setActiveNav('settings'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span>Settings</span></button>
                  <button className="pd-item" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('help'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>Help Center</span></button>
                </div>
                <div className="pd-divider"></div>
                <div className="pd-footer">
                  <button className="pd-item pd-item--danger" role="menuitem" tabIndex={pdOpen ? 0 : -1} onClick={() => { setPdOpen(false); setModal('logout'); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Logout</span></button>
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
            <div className="header-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search projects and tasks..." aria-label="Search projects and tasks" />
              {searchQuery.trim() && <div className="workspace-search-results" role="listbox" aria-label="Search results">
                {searchResults.length ? searchResults.map(({ project: result, matchingTasks }) => <button type="button" key={result.id} className="workspace-search-result" onClick={() => openSearchResult(result.id)}><strong>{result.name}</strong><span>{matchingTasks.length ? `${matchingTasks.length} matching task${matchingTasks.length === 1 ? '' : 's'}` : result.goal}</span></button>) : <span className="workspace-search-empty">No projects or tasks in this workspace match “{searchQuery}”.</span>}
              </div>}
            </div>
            <div className="header-actions">
              <button className="header-btn" aria-label="Notifications" onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="badge badge--danger"></span>
                {notifOpen && (
                  <div className="notifications-dropdown" onClick={e => e.stopPropagation()}>
                    <div className="notif-header">Notifications</div>
                    <div className="notif-item"><span className="notif-dot"></span> New workflow generated successfully</div>
                    <div className="notif-item"><span className="notif-dot"></span> Welcome to your FlowSync workspace!</div>
                  </div>
                )}
              </button>
              <button className="header-btn" aria-label="Inbox"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></button>
              <button className="header-date"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span></button>
              <div className="header-dropdown-wrap lang-dropdown-wrap">
                <svg className="lang-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <select className="header-dropdown" value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('flowsync-language', e.target.value); }} aria-label="Language selector">
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
                <WorkflowWorkspace createRequest={newProjectRequest} onCreateRequestHandled={() => setNewProjectRequest(0)} />
                
                {project && (
                  <>
                    <div className="db-title-row" style={{ marginTop: '2.5rem' }}>
                      <h2 className="db-title">FLOWSYNC • {company.toUpperCase()} OVERVIEW</h2>
                      <div className="db-badge-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>{t('global')}</span></div>
                    </div>

                    <div className="metrics-grid reveal-stagger">
                      <div className="metric-card glass-card ripple reveal">
                        <div className="m-card__header"><span className="m-card__title">Completed Tasks</span><span className="m-badge m-badge--success">Workspace</span></div>
                        <div className="m-card__value">{totalCompleted} / {totalTasks}</div>
                        <div className="m-card__chart">
                          <svg className="sparkline-svg" viewBox="0 0 120 40">
                            <defs>
                              <linearGradient id="sparkGradGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0"/>
                              </linearGradient>
                            </defs>
                            <path d="M 0 35 Q 15 28 30 32 T 60 22 T 90 28 T 120 10 L 120 40 L 0 40 Z" fill="url(#sparkGradGreen)"/>
                            <path d="M 0 35 Q 15 28 30 32 T 60 22 T 90 28 T 120 10" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>

                      <div className="metric-card glass-card ripple reveal">
                        <div className="m-card__header"><span className="m-card__title">Workspace Progress</span><span className="m-badge m-badge--blue">All Projects</span></div>
                        <div className="m-card__value">{workspaceProgress}%</div>
                        <div className="m-card__chart">
                          <svg className="sparkline-svg" viewBox="0 0 120 40">
                            <g fill="var(--color-primary, #2563EB)" opacity="0.85">
                              <rect x="5" y="24" width="8" height="16" rx="2"/>
                              <rect x="20" y="18" width="8" height="22" rx="2"/>
                              <rect x="35" y="26" width="8" height="14" rx="2"/>
                              <rect x="50" y="14" width="8" height="26" rx="2"/>
                              <rect x="65" y="20" width="8" height="20" rx="2"/>
                              <rect x="80" y="10" width="8" height="30" rx="2"/>
                              <rect x="95" y="16" width="8" height="24" rx="2"/>
                              <rect x="110" y="2" width="8" height="38" rx="2"/>
                            </g>
                          </svg>
                        </div>
                      </div>

                      <div className="metric-card glass-card ripple reveal">
                        <div className="m-card__header"><span className="m-card__title">In Progress Tasks</span><span className="m-badge m-badge--purple">Workspace</span></div>
                        <div className="m-card__content-row">
                          <div className="m-card__value">{totalInProgress} Tasks</div>
                          <div className="m-card__circular">
                            <svg width="44" height="44" viewBox="0 0 36 36">
                              <circle className="donut-track" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border-strong)" strokeWidth="3"/>
                              <circle 
                                className="donut-segment" 
                                cx="18" 
                                cy="18" 
                                r="15.915" 
                                fill="transparent" 
                                stroke="#7C3AED" 
                                strokeWidth="3.5" 
                                strokeDasharray={`${totalTasks ? Math.round((totalInProgress / totalTasks) * 100) : 0} ${totalTasks ? 100 - Math.round((totalInProgress / totalTasks) * 100) : 100}`}
                                strokeDashoffset="25"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="metric-card glass-card ripple reveal">
                        <div className="m-card__header"><span className="m-card__title">Total Projects</span><span className="m-badge m-badge--yellow">Workspace</span></div>
                        <div className="m-card__value" style={{ fontSize: '1.2rem', paddingTop: '0.5rem' }}>
                          {projects.length} project{projects.length === 1 ? '' : 's'}
                        </div>
                        <div className="m-card__chart">
                          <svg className="sparkline-svg" viewBox="0 0 120 40">
                            <defs>
                              <linearGradient id="sparkGradYellow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3"/>
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0"/>
                              </linearGradient>
                            </defs>
                            <path d="M 0 34 Q 30 28 60 20 T 100 10 T 120 6 L 120 40 L 0 40 Z" fill="url(#sparkGradYellow)"/>
                            <path d="M 0 34 Q 30 28 60 20 T 100 10 T 120 6" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="content-grid reveal-stagger">
                      <section className="grid-panel main-chart glass-card reveal" aria-labelledby="chart-heading">
                        <header className="panel-header">
                          <h2 className="panel-title" id="chart-heading">Workflow Phase Completion Rates</h2>
                          <div className="chart-legend">
                            <span className="legend-item"><span className="legend-dot" style={{background:'var(--color-primary, #2563EB)'}}></span>Completion %</span>
                          </div>
                        </header>
                        <div className="chart-container" id="trends-chart-container">
                          <svg className="main-chart-svg" viewBox="0 0 600 320" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartBlueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary, #2563EB)" stopOpacity="0.25"/>
                                <stop offset="100%" stopColor="var(--color-primary, #2563EB)" stopOpacity="0.0"/>
                              </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <g stroke="var(--border-subtle)" strokeWidth="1" opacity="0.7">
                              <line x1="50" y1="70" x2="570" y2="70"/>
                              <line x1="50" y1="120" x2="570" y2="120"/>
                              <line x1="50" y1="170" x2="570" y2="170"/>
                              <line x1="50" y1="220" x2="570" y2="220"/>
                              <line x1="50" y1="270" x2="570" y2="270"/>
                              
                              <line x1="50" y1="70" x2="50" y2="270"/>
                              <line x1="154" y1="70" x2="154" y2="270"/>
                              <line x1="258" y1="70" x2="258" y2="270"/>
                              <line x1="362" y1="70" x2="362" y2="270"/>
                              <line x1="466" y1="70" x2="466" y2="270"/>
                              <line x1="570" y1="70" x2="570" y2="270"/>
                            </g>
                            {/* Y axis labels */}
                            <g fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-num)" textAnchor="end">
                              <text x="40" y="74">100%</text>
                              <text x="40" y="124">75%</text>
                              <text x="40" y="174">50%</text>
                              <text x="40" y="224">25%</text>
                              <text x="40" y="274">0%</text>
                            </g>
                            {/* Dynamic SVG paths */}
                            <path d={fillD} fill="url(#chartBlueGrad)"/>
                            <path className="glow-line" d={pathD} fill="none" stroke="var(--color-primary, #2563EB)" strokeWidth="3" strokeLinecap="round"/>
                            {/* X axis labels */}
                            <g fill="var(--text-secondary)" fontSize="10" textAnchor="middle">
                              <text x="50" y="295">Planning</text>
                              <text x="154" y="295">Design</text>
                              <text x="258" y="295">Dev</text>
                              <text x="362" y="295">Content</text>
                              <text x="466" y="295">Testing</text>
                              <text x="570" y="295">Launch</text>
                            </g>
                            {/* Hotspots */}
                            {PHASES.map((phase, idx) => (
                              <circle 
                                key={phase}
                                cx={xCoords[idx]} 
                                cy={yCoords[idx]} 
                                r="6" 
                                fill="var(--color-primary, #2563EB)" 
                                stroke="white" 
                                strokeWidth="2" 
                                className="chart-hotspot"
                                data-phase={phase}
                                data-pct={Math.round(((270 - yCoords[idx]) / 200) * 100)}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                          </svg>
                          <div className="chart-tooltip" id="chart-tooltip">
                            <div className="tooltip-header">Planning</div>
                            <div className="tooltip-row">
                              <span className="tooltip-dot" style={{background:'var(--color-primary, #2563EB)'}}></span>
                              <span className="tooltip-label">Progress:</span>
                              <span className="tooltip-val">0% Complete</span>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="right-column reveal">
                        <section className="grid-panel project-status glass-card" aria-labelledby="project-heading">
                          <header className="panel-header">
                            <h2 className="panel-title" id="project-heading">My Workspaces</h2>
                            <span className="panel-sub">{projects.length} Active</span>
                          </header>
                          <div className="project-list reveal-stagger">
                            {projects.map((proj, idx) => {
                              const pct = getProjectProgress(proj.tasks);
                              const colors = ['#2563EB', '#7C3AED', '#10B981', '#EC4899', '#F59E0B'];
                              const color = colors[idx % colors.length];
                              const isActive = proj.id === project.id;
                              return (
                                <div 
                                  key={proj.id} 
                                  className={`project-item reveal ${isActive ? 'project-item--active' : ''}`}
                                  style={{ cursor: 'pointer', padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}
                                  onClick={() => selectProject(proj.id)}
                                >
                                  <div className="project-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span className="project-name" style={{ fontWeight: isActive ? '700' : '400', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                      {proj.name} {isActive && ' (Active)'}
                                    </span>
                                    <span className="project-progress-val" style={{ color }}>{pct}%</span>
                                  </div>
                                  <div className="project-progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div className="project-progress-fill" style={{ width: `${pct}%`, height: '100%', background: color }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>

                        <section className="grid-panel team-activity glass-card reveal" aria-labelledby="activity-heading">
                          <header className="panel-header"><h2 className="panel-title" id="activity-heading">{t('activityFeed')}</h2></header>
                          <div className="feed-list reveal-stagger">
                            {getActivityFeed().map((item, i) => (
                              <div key={i} className="feed-item reveal">
                                <div className="feed-avatar" style={{backgroundColor:item.bg,color:item.color}}>{item.initials}</div>
                                <div className="feed-content">
                                  <p className="feed-text"><strong className="feed-author">{item.author}</strong> <span>{item.text}</span></p>
                                  <span className="feed-time">{item.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeNav === 'projects' && (
              <div className="projects-tab-view glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2>Manage Workflow Projects</h2>
                  <button className="workflow-primary ripple" onClick={() => { setActiveNav('dashboard'); setNewProjectRequest((value) => value + 1); }}>
                    + Create New Project
                  </button>
                </div>
                {projects.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No projects found. Go back to the Dashboard to create one.</p>
                ) : (
                  <div className="projects-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {projects.map((proj) => {
                      const pct = getProjectProgress(proj.tasks);
                      const doneTasks = proj.tasks.filter(t => t.status === 'done').length;
                      return (
                        <div key={proj.id} className="project-detail-card glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{proj.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px', marginBottom: '.65rem' }}>{proj.goal}</p>
                          <p className="project-last-updated">Last updated {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <span>{doneTasks} of {proj.tasks.length} Completed</span>
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
                              Open Workspace
                            </button>
                            <button 
                              className="workflow-secondary ripple" 
                              style={{ padding: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444' }} 
                              onClick={() => { if (confirm('Delete this project?')) deleteProject(proj.id); }}
                            >
                              Delete
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
                <h2>Workspace Team Members</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Manage access and collaborate with teammates on your active project workflows.
                </p>

                <div className="team-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                  <div className="members-list-container">
                    <h3>Teammates ({teamList.length + 1})</h3>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                      {/* You (the user) */}
                      <div className="member-row glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="feed-avatar" style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: 'var(--color-primary)' }}>{getInitials(username)}</div>
                          <div>
                            <h4 style={{ margin: 0 }}>{username} (You)</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{email}</span>
                          </div>
                        </div>
                        <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {role} (Owner)
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
                    <h3>Invite Teammate</h3>
                    {inviteSuccess && (
                      <div className="alert-success" style={{ color: '#10B981', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                        ✓ Invitation sent successfully!
                      </div>
                    )}
                    <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Email Address
                          <input 
                            type="email" 
                            required
                            placeholder="teammate@company.com" 
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', color: 'white', marginTop: '0.4rem' }}
                          />
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Role
                          <select 
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', color: 'white', marginTop: '0.4rem' }}
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </label>
                      </div>
                      <button type="submit" className="workflow-primary ripple" style={{ width: '100%', padding: '0.6rem', marginTop: '0.5rem' }}>
                        Send Invitation
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'settings' && (
              <div className="settings-tab-view glass-card" style={{ padding: '2rem' }}>
                <h2>Workspace & Account Settings</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Customize your workspace settings, accent colors, and preferences.
                </p>

                <div className="settings-grid" style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
                  <div className="settings-section glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Workspace Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        Company / Workspace Name
                        <input 
                          type="text" 
                          value={company} 
                          onChange={(e) => { setCompany(e.target.value); localStorage.setItem('flowsync-company', e.target.value); }}
                          style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', color: 'white' }}
                        />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        Industry
                        <input 
                          type="text" 
                          value={industry} 
                          disabled
                          style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="settings-section glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Appearance Preferences</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Interface Theme</span>
                        <button className="workflow-secondary ripple" onClick={toggleTheme} style={{ padding: '0.5rem 1rem' }}>
                          Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
                        </button>
                      </div>
                      
                      <div>
                        <span style={{ display: 'block', marginBottom: '0.5rem' }}>Accent Palette</span>
                        <div style={{ display: 'flex', gap: '1rem' }}>
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
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: ACCENT_MAP[cKey].primary,
                                border: accent === cKey ? '3px solid white' : 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                              }}
                              className="accent-swatch"
                            />
                          ))}
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
            <div className="pd-modal-header"><span className="pd-modal-title">{modal === 'profile' ? 'Profile' : modal === 'appearance' ? 'Appearance' : modal === 'language' ? 'Language' : modal === 'help' ? 'Help Center' : 'Logout'}</span><button className="pd-modal-close" aria-label="Close" onClick={() => setModal(null)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            {modal === 'profile' && (<>
              <div className="pd-field"><span className="pd-field-label">Full Name</span><span className="pd-field-value">{username}</span></div>
              <div className="pd-field"><span className="pd-field-label">Email</span><span className="pd-field-value">{email}</span></div>
              <div className="pd-field"><span className="pd-field-label">Company</span><span className="pd-field-value">{company}</span></div>
              <div className="pd-field"><span className="pd-field-label">Industry</span><span className="pd-field-value">{industry}</span></div>
              <div className="pd-field"><span className="pd-field-label">Team Size</span><span className="pd-field-value">{members} members</span></div>
              <div className="pd-field"><span className="pd-field-label">Role</span><span className="pd-field-value">{role}</span></div>
              <div className="pd-field"><span className="pd-field-label">Theme</span><span className="pd-field-value">{theme === 'light' ? 'Light' : 'Dark'}</span></div>
              <div className="pd-field"><span className="pd-field-label">Language</span><span className="pd-field-value">{LANG_NAMES[lang] || 'English'}</span></div>
            </>)}
            {modal === 'appearance' && (<div className="pd-theme-options">
              {[{v:'light',icon:<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,label:'Light'},{v:'dark',icon:<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,label:'Dark'},{v:'system',icon:<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,label:'System'}].map(o => (
                <label key={o.v} className={`pd-theme-opt${theme === o.v ? ' is-active' : ''}`} onClick={() => { const resolved = o.v === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : o.v; setTheme(resolved); document.documentElement.setAttribute('data-theme', resolved === 'light' ? 'light' : ''); setWorkspaceTheme(resolved, getActiveEmail()); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{o.icon}</svg><span>{o.label}</span><span className="pd-theme-opt-indicator"></span>
                </label>
              ))}
            </div>)}
            {modal === 'language' && (<div className="pd-lang-options">
              {Object.entries(LANG_NAMES).slice(0, 4).map(([code, label]) => (
                <label key={code} className={`pd-lang-opt${lang === code ? ' is-active' : ''}`} onClick={() => { setLang(code); localStorage.setItem('flowsync-language', code); }}>
                  <span>{label}</span><span className="pd-lang-opt-check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                </label>
              ))}
            </div>)}
            {modal === 'help' && (<div className="pd-help-content"><p className="pd-help-text">Need help with FlowSync? Browse our resources or reach out to our support team.</p><div className="pd-help-links"><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Documentation</a><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Contact Support</a><a href="#" className="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Privacy & Security</a></div></div>)}
            {modal === 'logout' && (<div className="pd-confirm"><div className="pd-confirm-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><div className="pd-confirm-title">Logout?</div><p className="pd-confirm-msg">Are you sure you want to logout from FlowSync?</p><div className="pd-confirm-actions"><button className="pd-confirm-cancel" onClick={() => setModal(null)}>Cancel</button><button className="pd-confirm-logout" onClick={logout}>Logout</button></div></div>)}
          </div>
        </div>
      )}
    </>
  );
}
