import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TOPICS, PATHS } from '../data/roadmap';
import { VIDEOS } from '../data/videos';
import { ASSIGNMENTS } from '../data/assignments';
import { DOCUMENTATION } from '../data/documentation';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);
const PATH_IDS = [PATHS.JOB_READY, PATHS.INTERMEDIATE, PATHS.ADVANCED];

function getAssignmentForSubtopic(subtopicId) {
  return ASSIGNMENTS.find(a => a.subtopicId === subtopicId) || null;
}

function getRequiredVideoIds(subtopicId, assignment) {
  const subVideos = VIDEOS.filter(v => v.subtopicId === subtopicId && v.required !== false);
  if (!assignment?.requiredVideoIds?.length) return subVideos.map(v => v.id);
  const known = assignment.requiredVideoIds.filter(id => VIDEOS.some(v => v.id === id));
  return known.length ? known : subVideos.map(v => v.id);
}

function getRequiredDocIds(assignment) {
  return (assignment?.requiredDocIds || []).filter(id =>
    DOCUMENTATION.some(doc => doc.id === id && doc.topicId === assignment.topicId)
  );
}

function localDateKey(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [completedSubtopics, setCompletedSubtopics] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [projects, setProjects] = useState({});
  const [readResources, setReadResources] = useState([]);
  const [activePath, setActivePath] = useState(PATHS.JOB_READY);
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState(null);

  const progressRef = useRef({
    activePath: PATHS.JOB_READY, streak: 0, lastActive: null,
    completedSubtopics: [], completedTasks: [], completedVideos: [],
    readResources: [], assignments: {}, projects: {}
  });
  const persistQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    if (!user) {
      const empty = {
        activePath: PATHS.JOB_READY, streak: 0, lastActive: null,
        completedSubtopics: [], completedTasks: [], completedVideos: [],
        readResources: [], assignments: {}, projects: {}
      };
      progressRef.current = empty;
      setCompletedSubtopics([]); setCompletedTasks([]); setCompletedVideos([]);
      setAssignments({}); setProjects({}); setReadResources([]);
      setActivePath(PATHS.JOB_READY); setStreak(0); setLastActive(null);
      return undefined;
    }

    api.progress.get().then(p => {
      if (!mounted) return;
      const next = {
        activePath: PATH_IDS.includes(p.activePath) ? p.activePath : PATHS.JOB_READY,
        streak: p.streak || 0,
        lastActive: p.lastActive || null,
        completedSubtopics: p.completedSubtopics || [],
        completedTasks: p.completedTasks || [],
        completedVideos: p.completedVideos || [],
        assignments: p.assignments || {},
        projects: p.projects || {},
        readResources: p.readResources || {}
      };
      if (!Array.isArray(next.readResources)) next.readResources = [];
      progressRef.current = next;
      setActivePath(next.activePath); setStreak(next.streak); setLastActive(next.lastActive);
      setCompletedSubtopics(next.completedSubtopics); setCompletedTasks(next.completedTasks);
      setCompletedVideos(next.completedVideos); setAssignments(next.assignments);
      setProjects(next.projects); setReadResources(next.readResources);
    }).catch(err => console.error('Failed to load progress:', err));

    return () => { mounted = false; };
  }, [user]);

  const queuePersist = (snapshot) => {
    if (!user) return Promise.resolve();
    persistQueueRef.current = persistQueueRef.current
      .catch(() => {})
      .then(() => api.progress.update(snapshot))
      .catch(err => console.error('Progress sync failed:', err));
    return persistQueueRef.current;
  };

  const activity = (base) => {
    const todayKey = localDateKey();
    if (base.lastActive === todayKey) return { streak: base.streak, lastActive: todayKey };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = localDateKey(yesterday);
    return {
      streak: base.lastActive === yesterdayKey ? base.streak + 1 : 1,
      lastActive: todayKey
    };
  };

  const commit = (patch, markActivity = false) => {
    const base = progressRef.current;
    const activityPatch = markActivity ? activity(base) : {};
    const next = { ...base, ...patch, ...activityPatch };
    progressRef.current = next;
    setActivePath(next.activePath); setStreak(next.streak); setLastActive(next.lastActive);
    setCompletedSubtopics(next.completedSubtopics); setCompletedTasks(next.completedTasks);
    setCompletedVideos(next.completedVideos); setAssignments(next.assignments);
    setProjects(next.projects); setReadResources(next.readResources);
    return queuePersist(next);
  };

  const derivedCompletedSubtopics = useMemo(() => {
    const manualSubs = new Set(completedSubtopics);
    const derived = new Set();

    TOPICS.forEach(topic => {
      (topic.subtopicIds || []).forEach(subId => {
        const assignment = getAssignmentForSubtopic(subId);
        const assignmentRequired = Boolean(
          assignment && (!assignment.requiredPaths || assignment.requiredPaths.includes(activePath))
        );
        const requiredVideoIds = getRequiredVideoIds(subId, assignment);
        const requiredDocIds = getRequiredDocIds(assignment);
        const videosDone = requiredVideoIds.every(id => completedVideos.includes(id));
        const docsDone = requiredDocIds.every(id => readResources.includes(DOCUMENTATION.find(doc => doc.id === id)?.url));
        const assignmentDone = !assignmentRequired || assignment.githubRequired === false || assignments[assignment.id]?.status === 'Submitted';
        const hasRequirements = requiredVideoIds.length > 0 || requiredDocIds.length > 0 || assignmentRequired;

        if (!hasRequirements && manualSubs.has(subId)) derived.add(subId);
        else if (hasRequirements && videosDone && docsDone && assignmentDone) derived.add(subId);
      });
    });
    return Array.from(derived);
  }, [completedSubtopics, completedVideos, assignments, readResources, activePath]);

  const completedTopics = useMemo(
    () => TOPICS.filter(t => (t.subtopicIds || []).length > 0 && t.subtopicIds.every(id => derivedCompletedSubtopics.includes(id))).map(t => t.id),
    [derivedCompletedSubtopics]
  );

  const toggleSubtopic = id => commit({
    completedSubtopics: progressRef.current.completedSubtopics.includes(id)
      ? progressRef.current.completedSubtopics.filter(x => x !== id)
      : [...progressRef.current.completedSubtopics, id]
  }, true);

  const toggleTask = id => commit({
    completedTasks: progressRef.current.completedTasks.includes(id)
      ? progressRef.current.completedTasks.filter(x => x !== id)
      : [...progressRef.current.completedTasks, id]
  }, true);

  const submitAssignment = async (id, url) => {
    await api.assignments.submit(id, url);
    const next = { ...progressRef.current.assignments, [id]: { status: 'Submitted', url, updatedAt: new Date().toISOString() } };
    progressRef.current = { ...progressRef.current, assignments: next };
    setAssignments(next);
  };

  const submitProject = async (id, githubUrl, liveUrl) => {
    await api.projects.submit(id, githubUrl, liveUrl);
    const next = { ...progressRef.current.projects, [id]: { githubUrl, liveUrl, status: 'Submitted', updatedAt: new Date().toISOString() } };
    progressRef.current = { ...progressRef.current, projects: next };
    setProjects(next);
  };

  const markVideoComplete = (id, done) => commit({
    completedVideos: done
      ? (progressRef.current.completedVideos.includes(id) ? progressRef.current.completedVideos : [...progressRef.current.completedVideos, id])
      : progressRef.current.completedVideos.filter(x => x !== id)
  }, true);

  const markResourceRead = (id, read) => commit({
    readResources: read
      ? (progressRef.current.readResources.includes(id) ? progressRef.current.readResources : [...progressRef.current.readResources, id])
      : progressRef.current.readResources.filter(x => x !== id)
  }, true);

  const setPath = path => {
    if (!PATH_IDS.includes(path)) return;
    commit({ activePath: path }, true);
  };

  const getPathTopics = pathId => TOPICS.filter(t => t.paths.includes(pathId));
  const getPhaseProgress = (phaseId, pathId) => {
    const topics = TOPICS.filter(t => t.phaseId === phaseId && t.paths.includes(pathId));
    return topics.length ? Math.round(topics.filter(t => completedTopics.includes(t.id)).length / topics.length * 100) : 0;
  };
  const getNextIncompleteTopic = () => getPathTopics(activePath).find(t => !completedTopics.includes(t.id));

  const resetProgress = async () => {
    await queuePersist({
      ...progressRef.current, completedSubtopics: [], completedTasks: [], completedVideos: [],
      assignments: {}, projects: {}, readResources: [], streak: 0, lastActive: null
    });
    const empty = { ...progressRef.current, completedSubtopics: [], completedTasks: [], completedVideos: [], assignments: {}, projects: {}, readResources: [], streak: 0, lastActive: null };
    progressRef.current = empty;
    setCompletedSubtopics([]); setCompletedTasks([]); setCompletedVideos([]);
    setAssignments({}); setProjects({}); setReadResources([]); setStreak(0); setLastActive(null);
  };

  const getTotalLearningTime = () => Math.round(completedTopics.reduce((sum, id) => {
    const t = TOPICS.find(x => x.id === id);
    const m = t?.timeEstimate?.match(/(\d+(?:\.\d+)?)/);
    return sum + (m ? Number(m[1]) : 0);
  }, 0));

  return (
    <ProgressContext.Provider value={{
      completedTopics, completedSubtopics: derivedCompletedSubtopics, toggleSubtopic,
      completedTasks, toggleTask, completedVideos, markVideoComplete,
      assignments, submitAssignment, isAssignmentSubmitted: id => assignments[id]?.status === 'Submitted',
      projects, submitProject, readResources, markResourceRead,
      isResourceRead: id => readResources.includes(id), activePath, setPath, streak, lastActive,
      getTotalLearningTime, getPathTopics, getPhaseProgress, getNextIncompleteTopic, resetProgress,
      loading: false
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}