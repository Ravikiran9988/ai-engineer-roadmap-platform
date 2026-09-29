import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TOPICS, PATHS } from '../data/roadmap';
import { DAILY_TASKS } from '../data/learningData';
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
  return (assignment?.requiredDocIds || []).filter(id => DOCUMENTATION.some(doc => doc.id === id));
}

function getDocReadIds(docIds) {
  return DOCUMENTATION.filter(doc => docIds.includes(doc.id)).map(doc => doc.url);
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

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setCompletedSubtopics([]);
      setCompletedTasks([]);
      setCompletedVideos([]);
      setAssignments({});
      setProjects({});
      setReadResources([]);
      setActivePath(PATHS.JOB_READY);
      setStreak(0);
      setLastActive(null);
      return undefined;
    }

    api.progress.get().then(p => {
      if (!mounted) return;
      setActivePath(PATH_IDS.includes(p.activePath) ? p.activePath : PATHS.JOB_READY);
      setCompletedSubtopics(p.completedSubtopics || []);
      setCompletedTasks(p.completedTasks || []);
      setCompletedVideos(p.completedVideos || []);
      setAssignments(p.assignments || {});
      setProjects(p.projects || {});
      setReadResources(p.readResources || []);
      setStreak(p.streak || 0);
      setLastActive(p.lastActive || null);
    }).catch(err => console.error('Failed to load progress:', err));

    return () => { mounted = false; };
  }, [user]);

  const persist = async (overrides = {}) => {
    try {
      await api.progress.update({
        activePath,
        streak,
        lastActive,
        completedSubtopics,
        completedTasks,
        completedVideos,
        readResources,
        assignments,
        projects,
        ...overrides,
      });
    } catch (err) {
      console.error('Progress sync failed:', err);
    }
  };

  const activity = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const previous = lastActive ? new Date(lastActive) : null;
    let nextStreak = streak;
    if (lastActive !== todayKey) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      nextStreak = previous && previous.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)
        ? streak + 1
        : 1;
      setStreak(nextStreak);
      setLastActive(todayKey);
    }
    return { streak: nextStreak, lastActive: todayKey };
  };

  const derivedCompletedSubtopics = useMemo(() => {
    const manualSubs = new Set(completedSubtopics);
    const derived = new Set();

    TOPICS.forEach(topic => {
      (topic.subtopicIds || []).forEach(subId => {
        if (manualSubs.has(subId)) {
          derived.add(subId);
          return;
        }

        const assignment = getAssignmentForSubtopic(subId);
        const assignmentRequired = Boolean(
          assignment &&
          (!assignment.requiredPaths || assignment.requiredPaths.includes(activePath))
        );

        const requiredVideoIds = getRequiredVideoIds(subId, assignment);
        const requiredDocIds = getRequiredDocIds(assignment);
        const videosDone = requiredVideoIds.every(id => completedVideos.includes(id));
        const docsDone = requiredDocIds.every(id => readResources.includes(
          DOCUMENTATION.find(doc => doc.id === id)?.url
        ));
        const assignmentDone = !assignmentRequired ||
          assignment.githubRequired === false ||
          assignments[assignment.id]?.status === 'Submitted';

        const hasRequirements = requiredVideoIds.length > 0 || requiredDocIds.length > 0 || assignmentRequired;
        if (hasRequirements && videosDone && docsDone && assignmentDone) derived.add(subId);
      });
    });

    return Array.from(derived);
  }, [completedSubtopics, completedVideos, assignments, readResources, activePath]);

  const completedTopics = useMemo(
    () => TOPICS
      .filter(t => (t.subtopicIds || []).length > 0 && t.subtopicIds.every(id => derivedCompletedSubtopics.includes(id)))
      .map(t => t.id),
    [derivedCompletedSubtopics]
  );

  const toggleSubtopic = (id) => {
    const next = completedSubtopics.includes(id)
      ? completedSubtopics.filter(x => x !== id)
      : [...completedSubtopics, id];
    setCompletedSubtopics(next);
    persist({ completedSubtopics: next, ...activity() });
  };

  const toggleTask = (id) => {
    const next = completedTasks.includes(id)
      ? completedTasks.filter(x => x !== id)
      : [...completedTasks, id];
    setCompletedTasks(next);
    persist({ completedTasks: next, ...activity() });
  };

  const submitAssignment = async (id, url) => {
    try {
      await api.assignments.submit(id, url);
      const next = { ...assignments, [id]: { status: 'Submitted', url, updatedAt: new Date().toISOString() } };
      setAssignments(next);
    } catch (err) {
      console.error('Assignment submission failed:', err);
      throw err;
    }
  };

  const submitProject = async (id, githubUrl, liveUrl) => {
    try {
      await api.projects.submit(id, githubUrl, liveUrl);
      const next = { ...projects, [id]: { githubUrl, liveUrl, status: 'Submitted', updatedAt: new Date().toISOString() } };
      setProjects(next);
    } catch (err) {
      console.error('Project submission failed:', err);
      throw err;
    }
  };

  const markVideoComplete = (id, done) => {
    const next = done
      ? (completedVideos.includes(id) ? completedVideos : [...completedVideos, id])
      : completedVideos.filter(x => x !== id);
    setCompletedVideos(next);
    persist({ completedVideos: next, ...activity() });
  };

  const markResourceRead = (id, read) => {
    const next = read
      ? (readResources.includes(id) ? readResources : [...readResources, id])
      : readResources.filter(x => x !== id);
    setReadResources(next);
    persist({ readResources: next, ...activity() });
  };

  const setPath = (path) => {
    if (!PATH_IDS.includes(path)) return;
    setActivePath(path);
    persist({ activePath: path, ...activity() });
  };

  const getPathTopics = pathId => TOPICS.filter(t => t.paths.includes(pathId));

  const getPhaseProgress = (phaseId, pathId) => {
    const topics = TOPICS.filter(t => t.phaseId === phaseId && t.paths.includes(pathId));
    if (!topics.length) return 0;
    return Math.round(topics.filter(t => completedTopics.includes(t.id)).length / topics.length * 100);
  };

  const getNextIncompleteTopic = () => getPathTopics(activePath).find(t => !completedTopics.includes(t.id));

  const resetProgress = async () => {
    const empty = {
      completedSubtopics: [],
      completedTasks: [],
      completedVideos: [],
      assignments: {},
      projects: {},
      readResources: [],
      streak: 0,
      lastActive: null,
    };
    setCompletedSubtopics([]);
    setCompletedTasks([]);
    setCompletedVideos([]);
    setAssignments({});
    setProjects({});
    setReadResources([]);
    setStreak(0);
    setLastActive(null);
    await persist(empty);
  };

  const getTotalLearningTime = () => Math.round(completedTopics.reduce((sum, id) => {
    const t = TOPICS.find(x => x.id === id);
    const m = t?.timeEstimate?.match(/(\d+(?:\.\d+)?)/);
    return sum + (m ? Number(m[1]) : 0);
  }, 0));

  return (
    <ProgressContext.Provider value={{
      completedTopics,
      completedSubtopics: derivedCompletedSubtopics,
      toggleSubtopic,
      completedTasks,
      toggleTask,
      completedVideos,
      markVideoComplete,
      assignments,
      submitAssignment,
      isAssignmentSubmitted: id => assignments[id]?.status === 'Submitted',
      projects,
      submitProject,
      readResources,
      markResourceRead,
      isResourceRead: id => readResources.includes(id),
      activePath,
      setPath,
      streak,
      lastActive,
      getTotalLearningTime,
      getPathTopics,
      getPhaseProgress,
      getNextIncompleteTopic,
      resetProgress,
      loading: false,
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
