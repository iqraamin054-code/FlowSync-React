import { getActiveEmail, normalizeEmail } from './workspaceStorage.js';

const NOTIF_PREFIX = 'flowsync-notifications:';

function notifKey(email) {
  return `${NOTIF_PREFIX}${encodeURIComponent(normalizeEmail(email))}`;
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

let idCounter = Date.now();
function nextId() {
  return `notif_${++idCounter}`;
}

export function getNotifications(email = getActiveEmail()) {
  const normalized = normalizeEmail(email);
  if (!normalized) return [];
  return readJson(notifKey(normalized), []);
}

export function saveNotifications(email, notifications) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  writeJson(notifKey(normalized), notifications);
}

export function addNotification(email, notification) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  const list = getNotifications(normalized);
  const entry = {
    id: nextId(),
    read: false,
    timestamp: new Date().toISOString(),
    ...notification,
  };
  list.unshift(entry);
  saveNotifications(normalized, list.slice(0, 50));
  return entry;
}

export function markNotificationRead(email, notifId) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  const list = getNotifications(normalized);
  const idx = list.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], read: true };
    saveNotifications(normalized, list);
  }
}

export function markAllNotificationsRead(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  const list = getNotifications(normalized).map(n => ({ ...n, read: true }));
  saveNotifications(normalized, list);
}

export function getUnreadCount(email = getActiveEmail()) {
  return getNotifications(email).filter(n => !n.read).length;
}
