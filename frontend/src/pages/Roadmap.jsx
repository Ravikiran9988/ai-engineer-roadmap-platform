import React, { useMemo } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { PHASES, TOPICS, PATHS } from '@/data/roadmap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Roadmap() {
  const { activePath, completedTopics, completedSubtopics, getPhaseProgress } = useProgress();

  const pathName = activePath === PATHS.JOB_READY ? 'Job Ready' : 
                   activePath === PATHS.INTERMEDIATE ? 'Intermediate' : 'Advanced';

  // Group topics by phase
  const roadmapData = useMemo(() => {
    return PHASES.map(phase => {
      // Filter topics for this phase and active path
      const phaseTopics = TOPICS.filter(t => t.phaseId === phase.id && t.paths.includes(activePath));
      return {
        ...phase,
        topics: phaseTopics
      };
    });
  }, [activePath]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interactive Roadmap</h1>
          <p className="text-muted-foreground mt-1">
            Currently tracking the <span className="font-semibold text-primary">{pathName}</span> path.
          </p>
        </div>
        <Link to="/learning" className="text-sm text-primary hover:underline font-medium">
          Change Path &rarr;
        </Link>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-12 pl-6 md:pl-10">
        {roadmapData.map((phase, idx) => {
          if (phase.topics.length === 0) return null; // Hide phase if no topics for this path

          const progress = getPhaseProgress(phase.id, activePath);
          const isComplete = progress === 100;

          return (
            <div key={phase.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute -left-[35px] md:-left-[51px] top-6 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center ${
                isComplete ? 'bg-primary' : 'bg-secondary'
              }`}>
                {isComplete && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
              </div>

              <Card className={`transition-all duration-300 ${isComplete ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-muted-foreground tracking-widest uppercase">
                        Phase {idx + 1}
                      </div>
                      <CardTitle className="text-2xl hover:text-primary transition-colors">
                        <Link to={`/learning/${activePath}/${phase.id}`}>{phase.title}</Link>
                      </CardTitle>
                      <CardDescription className="text-base">
                        {phase.description}
                      </CardDescription>
                    </div>
                    
                    <div className="w-full md:w-32 space-y-2 shrink-0">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.topics.map(topic => {
                      const isTopicComplete = completedTopics.includes(topic.id);
                      return (
                        <div key={topic.id} className="group flex flex-col gap-2 p-3 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-colors">
                          <Link 
                            to={`/learning/${activePath}/${phase.id}/${topic.id}`}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 shrink-0">
                              {isTopicComplete ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${isTopicComplete ? 'line-through text-muted-foreground' : 'group-hover:text-primary'}`}>
                                {topic.name}
                              </h4>
                            </div>
                          </Link>
                          
                          {/* Subtopics list */}
                          {(topic.subtopics && topic.subtopics.length > 0) && (
                            <div className="ml-8 flex flex-col gap-1 mt-1">
                                {topic.subtopics.map((subtopicName, i) => {
                                  const subId = topic.subtopicIds ? topic.subtopicIds[i] : subtopicName.toLowerCase().replace(/\s+/g, '-');
                                  const isSubComplete = completedSubtopics?.includes(subId);
                                  return (
                                    <Link 
                                      key={subId}
                                      to={`/learning/${activePath}/${phase.id}/${topic.id}/${subId}`}
                                      className={`text-xs hover:text-primary flex items-center gap-2 ${isSubComplete ? 'text-muted-foreground/60 line-through' : 'text-muted-foreground'}`}
                                    >
                                      <div className={`w-1 h-1 rounded-full ${isSubComplete ? 'bg-primary/50' : 'bg-muted-foreground/50'}`} />
                                      <span className="truncate">{subtopicName}</span>
                                    </Link>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
