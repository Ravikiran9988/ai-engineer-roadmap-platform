import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '@/context/ProgressContext';
import { PATHS, TOPICS } from '@/data/roadmap';
import { Rocket, Zap, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LearningPaths() {
  const { activePath, setPath } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getStats = (pathId) => {
    const pathTopics = TOPICS.filter(t => t.paths.includes(pathId));
    const totalTime = pathTopics.reduce((acc, curr) => acc + parseInt(curr.timeEstimate), 0);
    return { topics: pathTopics.length, time: `${totalTime}h` };
  };

  const paths = [
    {
      id: PATHS.JOB_READY,
      title: "Job Ready",
      icon: <Rocket className="w-10 h-10 text-blue-500 mb-2" />,
      description: "Essential topics to get you hired as an AI/GenAI Engineer.",
      audience: "Entry-level roles, Software Engineers pivoting to AI.",
      highlights: ["Core Python & SQL", "LLM APIs & RAG", "FastAPI & Docker", "Basic Evaluation"],
      color: "border-blue-500/20 bg-blue-500/5",
      stats: getStats(PATHS.JOB_READY)
    },
    {
      id: PATHS.INTERMEDIATE,
      title: "Intermediate",
      icon: <Zap className="w-10 h-10 text-amber-500 mb-2" />,
      description: "Includes Job Ready + deeper ML/DL and MLOps fundamentals.",
      audience: "Mid-level AI Engineers, Data Scientists.",
      highlights: ["Supervised ML", "PyTorch Basics", "Fine-Tuning", "Experiment Tracking"],
      color: "border-amber-500/20 bg-amber-500/5",
      stats: getStats(PATHS.INTERMEDIATE)
    },
    {
      id: PATHS.ADVANCED,
      title: "Advanced",
      icon: <Brain className="w-10 h-10 text-purple-500 mb-2" />,
      description: "The full roadmap. Master advanced LLMs, infrastructure, and distributed systems.",
      audience: "Senior AI Engineers, AI Architects.",
      highlights: ["Transformers from Scratch", "Advanced RAG", "AI Security", "Distributed Systems"],
      color: "border-purple-500/20 bg-purple-500/5",
      stats: getStats(PATHS.ADVANCED)
    }
  ];

  const handleSelectPath = (pathId) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setPath(pathId);
    navigate('/roadmap');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
        <p className="text-muted-foreground max-w-2xl">
          Choose a learning path tailored to your goals. The roadmap will adapt to show only the topics relevant to your chosen path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map((path) => {
          const isActive = activePath === path.id;
          return (
            <Card 
              key={path.id} 
              className={`relative overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:border-primary/50'} ${path.color}`}
            >
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-primary text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Active
                </div>
              )}
              <CardHeader>
                {path.icon}
                <CardTitle className="text-2xl">{path.title}</CardTitle>
                <CardDescription className="text-base text-foreground/80 font-medium">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 uppercase text-muted-foreground tracking-wider">Ideal For</h4>
                  <p className="text-sm">{path.audience}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-3 uppercase text-muted-foreground tracking-wider">Key Highlights</h4>
                  <ul className="space-y-2">
                    {path.highlights.map((h, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{path.stats.topics}</span>
                    <span className="text-xs text-muted-foreground">Topics</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{path.stats.time}</span>
                    <span className="text-xs text-muted-foreground">Est. Time</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={isActive ? "default" : "outline"} 
                  className="w-full gap-2"
                  onClick={() => handleSelectPath(path.id)}
                >
                  {isActive ? "Continue Path" : "Select Path"}
                  {!isActive && <ArrowRight className="w-4 h-4" />}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
