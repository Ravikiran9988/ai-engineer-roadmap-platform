/**
 * resourceService.js
 * ──────────────────────────────────────────────────────────────
 * Helpers for querying the resource database.
 * All data comes from the centralized data files.
 */

import { VIDEOS } from '../data/videos.js';
import { PLAYLISTS } from '../data/playlists.js';
import { DOCUMENTATION } from '../data/documentation.js';
import { GITHUB_NOTES } from '../data/githubNotes.js';
import { PRACTICE_TASKS } from '../data/practiceTasks.js';

export const resourceService = {
  getVideosForTopic: (topicId, { pathId, type, difficulty } = {}) => {
    return VIDEOS
      .filter(v => v.topicId === topicId)
      .filter(v => !pathId || v.learningPaths.includes(pathId))
      .filter(v => !type || v.type === type)
      .filter(v => !difficulty || v.difficulty === difficulty)
      .sort((a, b) => a.order - b.order);
  },

  getPlaylistsForTopic: (topicId) =>
    PLAYLISTS.filter(p => p.topicId === topicId),

  getDocsForTopic: (topicId) =>
    DOCUMENTATION.filter(d => d.topicId === topicId || d.subtopicId?.startsWith(topicId)),

  getGithubForTopic: (topicId) =>
    GITHUB_NOTES.find(g => g.topicId === topicId) ?? null,

  getPracticeForTopic: (topicId, { pathId } = {}) =>
    PRACTICE_TASKS
      .filter(p => p.topicId === topicId)
      .filter(p => !pathId || p.learningPaths.includes(pathId)),

  searchResources: (query, { type } = {}) => {
    const q = query.toLowerCase();
    const all = [
      ...VIDEOS.map(v => ({ ...v, resourceType: 'video' })),
      ...PLAYLISTS.map(p => ({ ...p, resourceType: 'playlist' })),
      ...DOCUMENTATION.map(d => ({ ...d, resourceType: 'doc' })),
    ];
    return all
      .filter(r => !type || r.resourceType === type)
      .filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.channel?.toLowerCase().includes(q) ||
        r.topicId?.toLowerCase().includes(q)
      );
  },
};
