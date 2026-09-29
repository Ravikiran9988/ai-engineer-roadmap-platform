import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOPICS, PATHS } from '../data/roadmap';
import { DAILY_TASKS } from '../data/learningData';
import { api } from '../services/api';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completedSubtopics, setCompletedSubtopics] = useState([]); // Array of subtopic IDs
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]); // Array of video IDs
  const [assignments, setAssignments] = useState({}); // { id: { status, url } }
  const [projects, setProjects] = useState({}); // { id: { url, liveUrl } }
  const [readResources, setReadResources] = useState([]); // Array of resource IDs (docs/notes)
  const [activePath, setActivePath] = useState(PATHS.JOB_READY);
  
  // New metrics
  const [lastActive, setLastActive] = useState(null);
  const [streak, setStreak] = useState(0);

  // Load state on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadState = (key, setter) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try { setter(JSON.parse(saved)); } catch (e) {}
      }
    };

    const loadLocal = () => {
      loadState('ai-roadmap-subtopics', setCompletedSubtopics);
      loadState('ai-roadmap-tasks', setCompletedTasks);
      loadState('ai-roadmap-videos', setCompletedVideos);
      loadState('ai-roadmap-assignments', setAssignments);
      loadState('ai-roadmap-projects', setProjects);
      loadState('ai-roadmap-read-resources', setReadResources);
      loadState('ai-roadmap-streak', setStreak);
      loadState('ai-roadmap-lastActive', setLastActive);
      const savedPath = localStorage.getItem('ai-roadmap-path');
      if (savedPath) setActivePath(savedPath);
      updateStreak();
    };

    const loadRemote = async () => {
      try {
        const token = localStorage.getItem('ai-roadmap-token');
        if (token) {
          const res = await api.progress.get();
          if (isMounted) {
            if (res.activePath) setActivePath(res.activePath);
            setCompletedSubtopics(res.completedSubtopics || []);
            setCompletedTasks(res.completedTasks || []);
            setCompletedVideos(res.completedVideos || []);
            setAssignments(res.assignments || {});
            setProjects(res.projects || {});
            setReadResources(res.readResources || []);
            setStreak(res.streak || 0);
            setLastActive(res.lastActive || null);
            updateStreak();
          }
        } else {
          loadLocal();
        }
      } catch (err) {
        console.warn('Backend unavailable or failed. Falling back to localStorage.', err.message);
        if (isMounted) loadLocal();
      }
    };

    loadRemote();

    return () => { isMounted = false; };
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const savedLastActive = localStorage.getItem('ai-roadmap-lastActive');
    let currentStreak = parseInt(localStorage.getItem('ai-roadmap-streak') || '0', 10);

    if (savedLastActive !== `"${today}"`) {
      if (savedLastActive) {
        const lastDate = new Date(JSON.parse(savedLastActive));
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          currentStreak += 1;
        } else {
          currentStreak = 1; // reset streak if not active yesterday
        }
      } else {
        currentStreak = 1;
      }
      setStreak(currentStreak);
      setLastActive(today);
      localStorage.setItem('ai-roadmap-streak', currentStreak.toString());
      localStorage.setItem('ai-roadmap-lastActive', JSON.stringify(today));
    }
  };

  const syncWithBackend = async (dataOverride = {}) => {
    try {
      const token = localStorage.getItem('ai-roadmap-token');
      if (!token) return;
      await api.progress.update({
        activePath, streak, lastActive,
        completedSubtopics, completedTasks,
        completedVideos, readResources,
        assignments, projects,
        ...dataOverride
      });
    } catch (err) {
      console.warn('Backend sync failed. Using local storage.', err.message);
    }
  };

  const triggerActivity = () => {
    updateStreak();
    // syncWithBackend is called via individual handlers right now to capture fresh state
  };

  // Derived completed topics
  const completedTopics = React.useMemo(() => {
    return TOPICS.filter(topic => {
      const ids = topic.subtopicIds || [];
      return ids.length > 0 && ids.every(id => completedSubtopics.includes(id));
    }).map(t => t.id);
  }, [completedSubtopics]);

  const toggleSubtopic = (subtopicId) => {
    triggerActivity();
    setCompletedSubtopics((prev) => {
      const newSubs = prev.includes(subtopicId) ? prev.filter(id => id !== subtopicId) : [...prev, subtopicId];
      localStorage.setItem('ai-roadmap-subtopics', JSON.stringify(newSubs));
      syncWithBackend({ completedSubtopics: newSubs });
      return newSubs;
    });
  };

  const toggleTask = (taskId) => {
    triggerActivity();
    setCompletedTasks((prev) => {
      const newTasks = prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId];
      localStorage.setItem('ai-roadmap-tasks', JSON.stringify(newTasks));
      syncWithBackend({ completedTasks: newTasks });
      return newTasks;
    });
  };

  const submitAssignment = (assignmentId, url) => {
    triggerActivity();
    setAssignments(prev => {
      const newAssignments = { ...prev, [assignmentId]: { status: 'Submitted', url } };
      localStorage.setItem('ai-roadmap-assignments', JSON.stringify(newAssignments));
      syncWithBackend({ assignments: newAssignments });
      return newAssignments;
    });
  };

  const submitProject = (projectId, githubUrl, liveUrl) => {
    triggerActivity();
    setProjects(prev => {
      const newProjects = { ...prev, [projectId]: { githubUrl, liveUrl, status: 'Submitted' } };
      localStorage.setItem('ai-roadmap-projects', JSON.stringify(newProjects));
      syncWithBackend({ projects: newProjects });
      return newProjects;
    });
  };

  const markVideoComplete = (videoId, isDone) => {
    triggerActivity();
    setCompletedVideos(prev => {
      let newVideos;
      if (isDone) {
        newVideos = prev.includes(videoId) ? prev : [...prev, videoId];
      } else {
        newVideos = prev.filter(id => id !== videoId);
      }
      localStorage.setItem('ai-roadmap-videos', JSON.stringify(newVideos));
      syncWithBackend({ completedVideos: newVideos });
      return newVideos;
    });
  };

  const isAssignmentSubmitted = (assignmentId) => {
    return assignments[assignmentId]?.status === 'Submitted';
  };

  const markResourceRead = (resourceId, isRead) => {
    triggerActivity();
    setReadResources(prev => {
      let next;
      if (isRead) {
        next = prev.includes(resourceId) ? prev : [...prev, resourceId];
      } else {
        next = prev.filter(id => id !== resourceId);
      }
      localStorage.setItem('ai-roadmap-read-resources', JSON.stringify(next));
      syncWithBackend({ readResources: next });
      return next;
    });
  };

  const isResourceRead = (resourceId) => {
    return readResources.includes(resourceId);
  };

  const setPath = (path) => {
    setActivePath(path);
    localStorage.setItem('ai-roadmap-path', path);
    syncWithBackend({ activePath: path });
  };

  const getPathTopics = (pathId) => TOPICS.filter(t => t.paths.includes(pathId));

  const getPhaseProgress = (phaseId, pathId) => {
    const phaseTopics = TOPICS.filter(t => t.phaseId === phaseId && t.paths.includes(pathId));
    if (phaseTopics.length === 0) return 0;
    const completed = phaseTopics.filter(t => completedTopics.includes(t.id)).length;
    return Math.round((completed / phaseTopics.length) * 100);
  };

  const getNextIncompleteTopic = () => {
    const pathTopics = getPathTopics(activePath);
    return pathTopics.find(t => !completedTopics.includes(t.id));
  };

  const resetProgress = () => {
    setCompletedSubtopics([]);
    setCompletedTasks([]);
    setCompletedVideos([]);
    setAssignments({});
    setProjects({});
    setReadResources([]);
    setStreak(0);
    setLastActive(null);
    localStorage.removeItem('ai-roadmap-subtopics');
    localStorage.removeItem('ai-roadmap-tasks');
    localStorage.removeItem('ai-roadmap-videos');
    localStorage.removeItem('ai-roadmap-assignments');
    localStorage.removeItem('ai-roadmap-projects');
    localStorage.removeItem('ai-roadmap-read-resources');
    localStorage.removeItem('ai-roadmap-streak');
    localStorage.removeItem('ai-roadmap-lastActive');
  };

  const getTotalLearningTime = () => {
    // Basic calculation based on completed topics
    let totalHours = 0;
    completedTopics.forEach(id => {
      const topic = TOPICS.find(t => t.id === id);
      if (topic) {
        // Simple regex to extract numbers from "2h", "1.5h", etc.
        const match = topic.timeEstimate.match(/(\d+(\.\d+)?)/);
        if (match) {
          totalHours += parseFloat(match[1]);
        }
      }
    });
    return Math.round(totalHours);
  };

  return (
    <ProgressContext.Provider value={{ 
      completedTopics, 
      completedSubtopics, toggleSubtopic,
      completedTasks, toggleTask,
      completedVideos, markVideoComplete,
      assignments, submitAssignment, isAssignmentSubmitted,
      projects, submitProject,
      readResources, markResourceRead, isResourceRead,
      activePath, setPath,
      streak, getTotalLearningTime,
      getPathTopics, getPhaseProgress,
      getNextIncompleteTopic,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within ProgressProvider");
  return context;
}
