/**
 * learningData.js — BRIDGE FILE
 * ────────────────────────────────────────────────────────────
 * Re-exports from the new modular data files.
 * Maintains backward-compatibility with all existing imports:
 *
 *   import { ASSIGNMENTS, PROJECTS, DAILY_TASKS } from '@/data/learningData'
 *
 * DO NOT add new data here. Add it to the canonical files:
 *   - assignments.js → ASSIGNMENTS
 *   - projects.js    → PROJECTS
 *   - dailyTasks.js  → DAILY_TASKS
 * ────────────────────────────────────────────────────────────
 */

export { ASSIGNMENTS, ASSIGNMENT_MAP, getAssignmentsForTopic } from './assignments.js';
export { PROJECTS, PROJECT_MAP, getProjectForPhase, getCapstoneProject } from './projects.js';
export { DAILY_TASKS, getDailyTasksForPhase } from './dailyTasks.js';
