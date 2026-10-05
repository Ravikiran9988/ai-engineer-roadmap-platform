import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PHASES, TOPICS } from '@/data/roadmap';
import { DAILY_TASKS } from '@/data/learningData';
import { VIDEOS } from '@/data/videos';
import { DOCUMENTATION } from '@/data/documentation';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Circle, Clock, Target, AlertTriangle, CalendarDays, Code, PlayCircle, BookOpen, ExternalLink } from 'lucide-react';

export function PhaseDetail() {
  const { pathId, phaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { completedTopics, getPhaseProgress, completedTasks, toggleTask, activePath } = useProgress();
  const currentPathId = pathId || activePath;
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'daily'

  const handleAuthAction = (action) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    action();
  };

  const phase = PHASES.find(p => p.id === phaseId);
  
  if (!phase) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Phase not found</h2>
        <Button onClick={() => navigate('/roadmap')}>Back to Roadmap</Button>
      </div>
    );
  }

  // Get all topics for this phase that belong to the active path
  const phaseTopics = TOPICS.filter(t => t.phaseId === phase.id && t.paths.includes(currentPathId));
  const progress = getPhaseProgress(phase.id, currentPathId);

  // Group by priority
  const essential = phaseTopics.filter(t => t.priority === 'essential');
  const recommended = phaseTopics.filter(t => t.priority === 'recommended');
  const optional = phaseTopics.filter(t => t.priority === 'optional');

  const renderTopicGroup = (title, topics) => {
    if (topics.length === 0) return null;
    
    return (
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
          {title}
          <Badge variant="outline" className="ml-2">{topics.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {topics.map(topic => {
            const isComplete = completedTopics.includes(topic.id);
            return (
              <Card key={topic.id} className={`transition-all ${isComplete ? 'bg-secondary/20' : 'hover:border-primary/50'}`}>
                <div className="flex items-start md:items-center p-4 gap-4">
                  <div className="mt-1 md:mt-0 shrink-0 text-muted-foreground" title={isComplete ? "Completed" : "Incomplete"}>
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/learning/${currentPathId}/${phaseId}/${topic.id}`} className="hover:underline">
                      <h4 className={`text-base font-semibold ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                        {topic.name}
                      </h4>
                    </Link>
                    {topic.subtopics && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        Includes: {topic.subtopics.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5 w-20">
                      <Clock className="w-4 h-4" /> {topic.timeEstimate}
                    </div>
                    <div className="w-24">
                      <Badge variant="outline" className="w-full justify-center">
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/learning/${currentPathId}/${phaseId}/${topic.id}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <Button variant="ghost" className="mb-2 -ml-4 gap-2" onClick={() => navigate('/roadmap')}>
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </Button>

      <div className="bg-card border rounded-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Target className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Phase Detail
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{phase.title}</h1>
          <p className="text-lg text-muted-foreground">
            {phase.description}
          </p>
          
          <div className="pt-4 max-w-md space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Phase Progress</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {completedTopics.filter(id => phaseTopics.some(t => t.id === id)).length} of {phaseTopics.length} topics completed
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b">
        <button 
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'topics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('topics')}
        >
          All Topics
        </button>
        <button 
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'daily' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily Plan
        </button>
      </div>

      {activeTab === 'topics' && (
        phaseTopics.length === 0 ? (
          <Card className="bg-secondary/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-lg">No topics available in this phase for your current path.</p>
              <Button variant="outline" asChild>
                <Link to="/learning">Change Learning Path</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {renderTopicGroup("Essential Topics", essential)}
            {renderTopicGroup("Recommended Topics", recommended)}
            {renderTopicGroup("Optional Topics", optional)}
          </div>
        )
      )}

      {activeTab === 'daily' && (
        <div className="space-y-6 pt-4">
          {!DAILY_TASKS[phase.id] ? (
            <Card className="bg-secondary/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <CalendarDays className="w-10 h-10 text-muted-foreground" />
                <p className="font-medium">Daily plan for this phase is being generated.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {DAILY_TASKS[phase.id].map(task => {
                const taskId = `${phase.id}-day-${task.day}`;
                const isTaskComplete = completedTasks.includes(taskId);
                return (
                  <Card key={taskId} className={`transition-colors ${isTaskComplete ? 'bg-secondary/20 border-primary/20' : ''}`}>
                    <CardHeader className="pb-3 border-b bg-secondary/10 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Day {task.day}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" /> {task.timeEstimate}
                        </CardDescription>
                      </div>
                      <Button 
                        variant={isTaskComplete ? "outline" : "default"} 
                        size="sm"
                        className={isTaskComplete ? 'text-primary border-primary' : ''}
                        onClick={() => handleAuthAction(() => toggleTask(taskId))}
                      >
                        {isTaskComplete ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Done</> : "Mark Done"}
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Topics to Learn</h4>
                          <div className="flex flex-wrap gap-2">
                            {task.topics.map(t => {
                              const tObj = TOPICS.find(x => x.id === t);
                              return <Badge key={t} variant="outline" className="bg-background">{tObj?.name || t}</Badge>
                            })}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><PlayCircle className="w-4 h-4 text-red-500" /> Watch</h4>
                          <div className="space-y-2">
                            {(task.videoIds || task.videos || []).map((vidOrId, i) => {
                              // Support both old string format and new videoId format
                              const video = typeof vidOrId === 'string' && vidOrId.startsWith('vid_')
                                ? VIDEOS.find(v => v.id === vidOrId)
                                : null;
                              if (video) {
                                const isPending = video.url === 'RESOURCE_URL_PENDING';
                                return (
                                  <div key={video.id} className="flex items-start gap-2 p-2 rounded-md bg-secondary/20 border">
                                    <PlayCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{video.title}</p>
                                      <p className="text-[10px] text-muted-foreground">{video.channel} · {video.duration}</p>
                                    </div>
                                    {!isPending && (
                                      <a href={video.url} target="_blank" rel="noreferrer" className="shrink-0 text-[10px] text-primary hover:underline flex items-center gap-0.5">
                                        Watch <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                );
                              }
                              // Fallback for plain strings
                              return <p key={i} className="text-sm text-muted-foreground">{vidOrId}</p>;
                            })}
                          </div>
                          {(task.docIds || []).length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-amber-500" /> Read</h4>
                              <div className="space-y-1.5">
                                {(task.docIds || []).map(docId => {
                                  const doc = DOCUMENTATION.find(d => d.id === docId);
                                  if (!doc) return null;
                                  return (
                                    <a key={docId} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                      <ExternalLink className="w-3 h-3" /> {doc.title}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Code className="w-4 h-4 text-purple-500" /> Coding Task</h4>
                          <p className="text-sm text-muted-foreground p-3 bg-secondary/20 rounded-md border">{task.codingTask}</p>
                        </div>
                        {task.assignmentId && (
                          <div>
                            <Button variant="outline" size="sm" className="w-full text-blue-500 border-blue-500/30 hover:bg-blue-500/10" asChild>
                              <Link to="/assignments">View Assignment →</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
