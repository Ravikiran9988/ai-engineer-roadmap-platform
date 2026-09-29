import fs from 'fs';
import path from 'path';

// Note: since the data files are ES modules, we need a way to import them or parse them.
// We'll write this script as an ES module or just use dynamic import.
const audit = async () => {
  // Use dynamic import for the ES modules
  const topicsModule = await import('./src/data/topics.js');
  const videosModule = await import('./src/data/videos.js');
  const assignmentsModule = await import('./src/data/assignments.js');
  const docsModule = await import('./src/data/documentation.js');
  const githubModule = await import('./src/data/githubNotes.js');
  const practiceModule = await import('./src/data/practiceTasks.js');
  const dailyModule = await import('./src/data/dailyTasks.js');

  const TOPICS = topicsModule.TOPICS;
  const VIDEOS = videosModule.VIDEOS;
  const ASSIGNMENTS = assignmentsModule.ASSIGNMENTS;
  const DOCUMENTATION = docsModule.DOCUMENTATION;
  const GITHUB_NOTES = githubModule.GITHUB_NOTES;
  const PRACTICE_TASKS = practiceModule.PRACTICE_TASKS;
  const DAILY_TASKS = dailyModule.DAILY_TASKS;

  const topicMap = new Map();
  const subtopicMap = new Map();

  TOPICS.forEach(t => {
    topicMap.set(t.id, t);
    if (t.subtopics) {
      t.subtopics.forEach((sub, i) => {
        const subId = t.subtopicIds ? t.subtopicIds[i] : sub.toLowerCase().replace(/\s+/g, '-');
        subtopicMap.set(`${t.id}::${subId}`, true);
        subtopicMap.set(`any::${subId}`, true); // sometimes they just reference subtopicId
      });
    }
  });

  const errors = [];

  // Check Videos
  VIDEOS.forEach(v => {
    if (!topicMap.has(v.topicId)) errors.push(`Video ${v.id}: topicId '${v.topicId}' not found`);
    if (v.subtopicId) {
      if (!subtopicMap.has(`any::${v.subtopicId}`)) errors.push(`Video ${v.id}: subtopicId '${v.subtopicId}' not found`);
    }
  });

  // Check Assignments
  ASSIGNMENTS.forEach(a => {
    if (!topicMap.has(a.topicId)) errors.push(`Assignment ${a.id}: topicId '${a.topicId}' not found`);
    if (a.subtopicId) {
      if (!subtopicMap.has(`any::${a.subtopicId}`)) errors.push(`Assignment ${a.id}: subtopicId '${a.subtopicId}' not found`);
    }
  });

  // Check Documentation
  DOCUMENTATION.forEach(d => {
    if (!topicMap.has(d.topicId)) errors.push(`Doc ${d.id}: topicId '${d.topicId}' not found`);
    if (d.subtopicId) {
      if (!subtopicMap.has(`any::${d.subtopicId}`)) errors.push(`Doc ${d.id}: subtopicId '${d.subtopicId}' not found`);
    }
  });

  // Check GitHub Notes
  GITHUB_NOTES.forEach(g => {
    if (!topicMap.has(g.topicId)) errors.push(`GitHub Note ${g.id}: topicId '${g.topicId}' not found`);
  });

  // Check Practice Tasks
  PRACTICE_TASKS.forEach(p => {
    if (!topicMap.has(p.topicId)) errors.push(`Practice Task ${p.id}: topicId '${p.topicId}' not found`);
  });

  console.log('AUDIT RESULTS:');
  if (errors.length === 0) {
    console.log('No ID mismatches found.');
  } else {
    errors.forEach(e => console.log(e));
  }
};

audit().catch(console.error);
