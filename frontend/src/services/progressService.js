/**
 * progressService.js
 * ──────────────────────────────────────────────────────────────
 * Centralized read/write for all progress state in localStorage.
 *
 * Architecture note:
 *   Currently backed by localStorage.
 *   Replace the STORAGE object below to swap in a REST API backend
 *   without changing any component code.
 */

const KEYS = {
  TOPICS: 'ai-roadmap-progress',
  TASKS: 'ai-roadmap-tasks',
  ASSIGNMENTS: 'ai-roadmap-assignments',
  PROJECTS: 'ai-roadmap-projects',
  STREAK: 'ai-roadmap-streak',
  LAST_ACTIVE: 'ai-roadmap-lastActive',
  PATH: 'ai-roadmap-path',
  WATCHED_VIDEOS: 'ai-watched-videos',
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`[progressService] Failed to write key: ${key}`);
  }
}

export const progressService = {
  // ─── Topics ──────────────────────────────────────────────
  getCompletedTopics: () => safeGet(KEYS.TOPICS, []),
  setCompletedTopics: (ids) => safeSet(KEYS.TOPICS, ids),

  // ─── Daily Tasks ─────────────────────────────────────────
  getCompletedTasks: () => safeGet(KEYS.TASKS, []),
  setCompletedTasks: (ids) => safeSet(KEYS.TASKS, ids),

  // ─── Assignments ─────────────────────────────────────────
  getAssignments: () => safeGet(KEYS.ASSIGNMENTS, {}),
  setAssignments: (map) => safeSet(KEYS.ASSIGNMENTS, map),

  // ─── Projects ────────────────────────────────────────────
  getProjects: () => safeGet(KEYS.PROJECTS, {}),
  setProjects: (map) => safeSet(KEYS.PROJECTS, map),

  // ─── Streak ──────────────────────────────────────────────
  getStreak: () => safeGet(KEYS.STREAK, 0),
  setStreak: (n) => safeSet(KEYS.STREAK, n),

  getLastActive: () => safeGet(KEYS.LAST_ACTIVE, null),
  setLastActive: (dateStr) => safeSet(KEYS.LAST_ACTIVE, dateStr),

  // ─── Active Learning Path ─────────────────────────────────
  getActivePath: () => localStorage.getItem(KEYS.PATH) || 'job_ready',
  setActivePath: (pathId) => localStorage.setItem(KEYS.PATH, pathId),

  // ─── Watched Videos (UI-level, not in ProgressContext) ───
  getWatchedVideos: () => safeGet(KEYS.WATCHED_VIDEOS, []),
  setWatchedVideos: (ids) => safeSet(KEYS.WATCHED_VIDEOS, ids),

  // ─── Full Reset ──────────────────────────────────────────
  resetAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
