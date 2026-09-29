import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Zap, Brain, ArrowRight } from 'lucide-react';
import { TOPICS, PATHS } from '@/data/roadmap';

export function Home() {
  const { user } = useAuth();
  const { activePath, completedTopics, completedSubtopics, setPath } = useProgress();
  const navigate = useNavigate();

  // Determine if the user has explicitly selected a path.
  const hasSelectedPath = !!activePath;

  const handleSelectPath = (pathId) => {
    if (!user) {
      navigate(`/login?redirect=/`);
      return;
    }
    setPath(pathId);
    navigate('/');
  };

  const getFirstIncompleteSubtopic = () => {
    if (!activePath) return null;
    const pathTopics = TOPICS.filter(t => t.paths.includes(activePath));
    for (const topic of pathTopics) {
      if (!completedTopics.includes(topic.id)) {
        if (topic.subtopics && topic.subtopics.length > 0) {
          for (let i = 0; i < topic.subtopics.length; i++) {
            const subId = topic.subtopicIds ? topic.subtopicIds[i] : topic.subtopics[i].toLowerCase().replace(/\s+/g, '-');
            if (!completedSubtopics.includes(subId)) {
              return { topic, subId, subName: topic.subtopics[i] };
            }
          }
        }
      }
    }
    return null;
  };

  const nextLearning = getFirstIncompleteSubtopic();

  if (!user || !hasSelectedPath) {
    return (
      <div className="space-y-12 pb-16 animate-in fade-in duration-500 text-center pt-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">AI Engineer Roadmap</h1>
          <p className="text-lg text-muted-foreground">
            Learn AI engineering from foundations to production. Choose a learning path to get started, track your progress, and build real-world projects.
          </p>
          {!user && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link to="/login?redirect=/">Start Learning</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/roadmap">Explore Roadmap</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Choose Your Learning Path</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Rocket className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Job Ready</CardTitle>
                <CardDescription>Essential AI Engineering skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleSelectPath(PATHS.JOB_READY)}>
                  Select Path
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-amber-500 mb-2" />
                <CardTitle>Intermediate</CardTitle>
                <CardDescription>Deeper AI Engineering knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleSelectPath(PATHS.INTERMEDIATE)}>
                  Select Path
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Brain className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle>Advanced</CardTitle>
                <CardDescription>Advanced / production concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleSelectPath(PATHS.ADVANCED)}>
                  Select Path
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Returning user with a selected path
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.username || user.name}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Current Path: <span className="font-semibold text-primary capitalize">{activePath.replace('_', ' ')}</span>
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          {nextLearning ? (
            <div className="space-y-4">
              <div className="text-lg font-medium flex items-center gap-2">
                <span className="text-muted-foreground">{nextLearning.topic.name}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span>{nextLearning.subName}</span>
              </div>
              <Button asChild size="lg">
                <Link to={`/learning/${activePath}/${nextLearning.topic.phaseId}/${nextLearning.topic.id}/${nextLearning.subId}`}>
                  Continue
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-medium">You have completed all topics in your current path!</p>
              <Button asChild variant="outline">
                <Link to="/learning">Change Learning Path</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/learning">Change Learning Path</Link>
        </Button>
      </div>
    </div>
  );
}
