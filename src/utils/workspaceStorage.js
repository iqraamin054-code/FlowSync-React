const USERS_KEY = 'flowsync-users';
const ACTIVE_EMAIL_KEY = 'flowsync-active-email';
const WORKSPACE_PREFIX = 'flowsync-workspace:';
const LEGACY_PROJECTS_KEY = 'flowsync-projects-list';
const LEGACY_CURRENT_PROJECT_KEY = 'flowsync-current-project-id';

export function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function workspaceKey(email) {
  return `${WORKSPACE_PREFIX}${encodeURIComponent(normalizeEmail(email))}`;
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJson(USERS_KEY, {});
}

export function getUser(email) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  if (users[normalized]) return users[normalized];

  // One-time compatibility path for the original single-account demo.
  const legacyEmail = normalizeEmail(localStorage.getItem('flowsync-email') || '');
  if (legacyEmail === normalized) {
    return {
      email: legacyEmail,
      password: localStorage.getItem('flowsync-password') || '',
      profile: {
        name: localStorage.getItem('flowsync-username') || '',
        company: localStorage.getItem('flowsync-company') || '',
      },
    };
  }
  return null;
}

export function registerWorkspaceUser({ email, password, profile = {}, theme = 'dark' }) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  users[normalized] = { email: normalized, password, profile, createdAt: new Date().toISOString() };
  writeJson(USERS_KEY, users);
  setActiveEmail(normalized);
  const workspace = getWorkspace(normalized);
  saveWorkspace(normalized, { ...workspace, email: normalized, theme, profile: { ...workspace.profile, ...profile } });
  return normalized;
}

export function setActiveEmail(email) {
  const normalized = normalizeEmail(email);
  localStorage.setItem(ACTIVE_EMAIL_KEY, normalized);
  localStorage.setItem('flowsync-email', normalized);
  return normalized;
}

export function getActiveEmail() {
  return normalizeEmail(localStorage.getItem(ACTIVE_EMAIL_KEY) || localStorage.getItem('flowsync-email') || '');
}

export function getWorkspace(email = getActiveEmail()) {
  const normalized = normalizeEmail(email);
  const fallback = { email: normalized, projects: [], activeProjectId: null, theme: 'dark', profile: {} };
  if (!normalized) return fallback;

  const saved = readJson(workspaceKey(normalized), null);
  if (saved) return { ...fallback, ...saved, projects: Array.isArray(saved.projects) ? saved.projects : [] };

  // Migrate the former global project list only for its recorded owner.
  const legacyOwner = normalizeEmail(localStorage.getItem('flowsync-email') || '');
  if (legacyOwner === normalized) {
    const projects = readJson(LEGACY_PROJECTS_KEY, []);
    const activeProjectId = localStorage.getItem(LEGACY_CURRENT_PROJECT_KEY) || projects[0]?.id || null;
    if (projects.length) {
      const migrated = { ...fallback, projects, activeProjectId, theme: localStorage.getItem('flowsync-theme') === 'light' ? 'light' : 'dark' };
      saveWorkspace(normalized, migrated);
      localStorage.removeItem(LEGACY_PROJECTS_KEY);
      localStorage.removeItem(LEGACY_CURRENT_PROJECT_KEY);
      return migrated;
    }
  }
  return fallback;
}

export function saveWorkspace(email, workspace) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  writeJson(workspaceKey(normalized), { ...workspace, email: normalized, updatedAt: new Date().toISOString() });
}

export function setWorkspaceTheme(theme, email = getActiveEmail()) {
  const workspace = getWorkspace(email);
  saveWorkspace(email, { ...workspace, theme });
  // Kept for the landing/onboarding styles that read the existing global key.
  localStorage.setItem('flowsync-theme', theme === 'light' ? 'light' : '');
}

export function updateWorkspaceProfile(profile, email = getActiveEmail()) {
  const normalized = normalizeEmail(email);
  const workspace = getWorkspace(normalized);
  const nextProfile = { ...workspace.profile, ...profile };
  saveWorkspace(normalized, { ...workspace, profile: nextProfile });
  const users = getUsers();
  if (users[normalized]) {
    users[normalized] = { ...users[normalized], profile: { ...users[normalized].profile, ...profile } };
    writeJson(USERS_KEY, users);
  }
}
