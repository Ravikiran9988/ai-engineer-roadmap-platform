import React from 'react';
import { useProgress } from '@/context/ProgressContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle2, Flame, Clock, GitBranch, LayoutGrid, AlertCircle, ArrowRight } from 'lucide-react';
import { TOPICS, PATHS } from '@/data/roadmap';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ProgressDashboard() {
  const { 
    completedTopics, 
    completedVideos,
    assignments, 
    projects,
    streak,
    getTotalLearningTime,
    activePath
  } = useProgress();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No progress yet</h2>
        <p className="text-muted-foreground max-w-md">Start your AI Engineer learning journey by signing in to track your progress and submit assignments.</p>
        <Button asChild className="mt-4">
          <Link to="/login?redirect=/progress">Sign In</Link>
        </Button>
      </div>
    );
  }

  const activePathTopics = TOPICS.filter(t => t.paths.includes(activePath));
  const totalTopics = activePathTopics.length;
  const topicsDone = completedTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((topicsDone / totalTopics) * 100) : 0;

  const totalAssignments = Object.keys(assignments).length;
  const totalProjects = Object.keys(projects).length;
  const totalVideos = completedVideos.length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Track your learning journey across the AI Engineer Roadmap.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between font-medium">
            <span>{progressPercent}% Completed</span>
            <span>{topicsDone} / {totalTopics} Topics</span>
          </div>
          <Progress value={progressPercent} className="h-4" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Flame className="w-10 h-10 text-orange-500" />
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Clock className="w-10 h-10 text-blue-500" />
            <div className="text-3xl font-bold">{getTotalLearningTime()}h</div>
            <div className="text-sm text-muted-foreground">Est. Learning Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <LayoutGrid className="w-10 h-10 text-green-500" />
            <div className="text-3xl font-bold">{topicsDone}</div>
            <div className="text-sm text-muted-foreground">Topics Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-purple-500" />
            <div className="text-3xl font-bold">{totalVideos}</div>
            <div className="text-sm text-muted-foreground">Videos Watched</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <GitBranch className="w-10 h-10 text-foreground" />
            <div className="text-3xl font-bold">{totalAssignments}</div>
            <div className="text-sm text-muted-foreground">Assignments Submitted</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <div className="text-3xl font-bold">{totalProjects}</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <GitBranch className="w-6 h-6" /> My Submissions
        </h2>
        <Card>
          <CardContent className="p-0">
            {totalAssignments === 0 && totalProjects === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No submissions yet. Start learning and submit your practical assignments!
              </div>
            ) : (
              <div className="divide-y">
                {Object.entries(assignments).map(([id, sub]) => (
                  <div key={id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm">{id.replace('assignment-', 'Assignment: ')}</h4>
                      <a href={sub.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                        {sub.url} <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{sub.status}</Badge>
                  </div>
                ))}
                {Object.entries(projects).map(([id, sub]) => (
                  <div key={id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm">Project: {id}</h4>
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                        {sub.githubUrl} <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{sub.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
