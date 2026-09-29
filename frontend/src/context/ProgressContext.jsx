import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TOPICS, PATHS } from '../data/roadmap';
import { DAILY_TASKS } from '../data/learningData';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [completedSubtopics,setCompletedSubtopics]=useState([]);
  const [completedTasks,setCompletedTasks]=useState([]);
  const [completedVideos,setCompletedVideos]=useState([]);
  const [assignments,setAssignments]=useState({});
  const [projects,setProjects]=useState({});
  const [readResources,setReadResources]=useState([]);
  const [activePath,setActivePath]=useState(PATHS.JOB_READY);
  const [streak,setStreak]=useState(0);
  const [lastActive,setLastActive]=useState(null);

  useEffect(()=>{
    let mounted=true;
    if(!user){
      setCompletedSubtopics([]); setCompletedTasks([]); setCompletedVideos([]);
      setAssignments({}); setProjects({}); setReadResources([]);
      setActivePath(PATHS.JOB_READY); setStreak(0); setLastActive(null);
      return;
    }
    api.progress.get().then(p=>{
      if(!mounted)return;
      setActivePath(p.activePath||PATHS.JOB_READY);
      setCompletedSubtopics(p.completedSubtopics||[]);
      setCompletedTasks(p.completedTasks||[]);
      setCompletedVideos(p.completedVideos||[]);
      setAssignments(p.assignments||{});
      setProjects(p.projects||{});
      setReadResources(p.readResources||[]);
      setStreak(p.streak||0);
      setLastActive(p.lastActive||null);
    }).catch(err=>console.error('Failed to load progress:',err));
    return ()=>{mounted=false};
  },[user]);

  const persist=async(overrides={})=>{
    try{
      await api.progress.update({
        activePath,streak,lastActive,completedSubtopics,completedTasks,
        completedVideos,readResources,assignments,projects,...overrides
      });
    }catch(err){console.error('Progress sync failed:',err)}
  };

  const activity=()=>{
    const today=new Date();
    const todayKey=today.toISOString().slice(0,10);
    const previous=lastActive ? new Date(lastActive) : null;
    let nextStreak=streak;
    if(lastActive!==todayKey){
      const yesterday=new Date(today); yesterday.setDate(today.getDate()-1);
      nextStreak=previous && previous.toISOString().slice(0,10)===yesterday.toISOString().slice(0,10) ? streak+1 : 1;
      setStreak(nextStreak); setLastActive(todayKey);
    }
    return {streak:nextStreak,lastActive:todayKey};
  };

  const completedTopics=useMemo(()=>TOPICS.filter(t=>(t.subtopicIds||[]).length>0 && t.subtopicIds.every(id=>completedSubtopics.includes(id))).map(t=>t.id),[completedSubtopics]);

  const toggleSubtopic=(id)=>{
    const next=completedSubtopics.includes(id)?completedSubtopics.filter(x=>x!==id):[...completedSubtopics,id];
    setCompletedSubtopics(next); persist({completedSubtopics:next,...activity()});
  };
  const toggleTask=(id)=>{
    const next=completedTasks.includes(id)?completedTasks.filter(x=>x!==id):[...completedTasks,id];
    setCompletedTasks(next); persist({completedTasks:next,...activity()});
  };
  const submitAssignment=(id,url)=>{
    const next={...assignments,[id]:{status:'Submitted',url,updatedAt:new Date().toISOString()}};
    setAssignments(next); persist({assignments:next,...activity()});
  };
  const submitProject=(id,githubUrl,liveUrl)=>{
    const next={...projects,[id]:{githubUrl,liveUrl,status:'Submitted',updatedAt:new Date().toISOString()}};
    setProjects(next); persist({projects:next,...activity()});
  };
  const markVideoComplete=(id,done)=>{
    const next=done?(completedVideos.includes(id)?completedVideos:[...completedVideos,id]):completedVideos.filter(x=>x!==id);
    setCompletedVideos(next); persist({completedVideos:next,...activity()});
  };
  const markResourceRead=(id,read)=>{
    const next=read?(readResources.includes(id)?readResources:[...readResources,id]):readResources.filter(x=>x!==id);
    setReadResources(next); persist({readResources:next,...activity()});
  };
  const setPath=(path)=>{
    setActivePath(path); persist({activePath:path,...activity()});
  };
  const getPathTopics=pathId=>TOPICS.filter(t=>t.paths.includes(pathId));
  const getPhaseProgress=(phaseId,pathId)=>{
    const topics=TOPICS.filter(t=>t.phaseId===phaseId&&t.paths.includes(pathId));
    if(!topics.length)return 0;
    return Math.round(topics.filter(t=>completedTopics.includes(t.id)).length/topics.length*100);
  };
  const getNextIncompleteTopic=()=>getPathTopics(activePath).find(t=>!completedTopics.includes(t.id));
  const resetProgress=async()=>{
    setCompletedSubtopics([]);setCompletedTasks([]);setCompletedVideos([]);setAssignments({});setProjects({});setReadResources([]);setStreak(0);setLastActive(null);
    await persist({completedSubtopics:[],completedTasks:[],completedVideos:[],assignments:{},projects:{},readResources:[],streak:0,lastActive:null});
  };
  const getTotalLearningTime=()=>Math.round(completedTopics.reduce((sum,id)=>{
    const t=TOPICS.find(x=>x.id===id); const m=t?.timeEstimate?.match(/(\d+(?:\.\d+)?)/); return sum+(m?Number(m[1]):0);
  },0));

  return <ProgressContext.Provider value={{
    completedTopics,completedSubtopics,toggleSubtopic,completedTasks,toggleTask,
    completedVideos,markVideoComplete,assignments,submitAssignment,
    isAssignmentSubmitted:id=>assignments[id]?.status==='Submitted',
    projects,submitProject,readResources,markResourceRead,isResourceRead:id=>readResources.includes(id),
    activePath,setPath,streak,lastActive,getTotalLearningTime,getPathTopics,getPhaseProgress,
    getNextIncompleteTopic,resetProgress,loading:false
  }}>{children}</ProgressContext.Provider>;
}

export function useProgress(){
  const context=useContext(ProgressContext);
  if(!context)throw new Error('useProgress must be used within ProgressProvider');
  return context;
}