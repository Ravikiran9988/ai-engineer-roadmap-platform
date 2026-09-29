/**
 * roadmap.js — BRIDGE FILE
 * ────────────────────────────────────────────────────────────
 * Re-exports from the new modular data files.
 * Maintains backward-compatibility with all existing imports:
 *
 *   import { PHASES, TOPICS, PATHS } from '@/data/roadmap'
 *
 * DO NOT add new data here. Add it to the canonical files:
 *   - phases.js   → PHASES
 *   - topics.js   → TOPICS
 *   - learningPaths.js → PATHS
 * ────────────────────────────────────────────────────────────
 */

export { PHASES, PHASE_MAP } from './phases.js';
export { TOPICS, TOPIC_MAP } from './topics.js';
export { PATHS, LEARNING_PATHS, LEARNING_PATH_MAP } from './learningPaths.js';
