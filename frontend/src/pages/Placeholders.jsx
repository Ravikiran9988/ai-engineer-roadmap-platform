import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Pickaxe } from 'lucide-react';

function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
        <Pickaxe className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card className="w-full max-w-lg mt-8 bg-card/50 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" /> Coming Soon
          </CardTitle>
          <CardDescription>
            This section is currently under development. We're building premium content and interactive tools for you.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export const LearningPaths = () => <PlaceholderPage title="Learning Paths" description="Curated tracks to guide you from beginner to expert based on your career goals." />;
export const Roadmap = () => <PlaceholderPage title="Interactive Roadmap" description="Detailed step-by-step nodes for every skill in the AI engineering ecosystem." />;
export const KnowledgeBase = () => <PlaceholderPage title="Knowledge Base" description="Deep dive articles, math primers, and code snippets." />;
export const Assignments = () => <PlaceholderPage title="Assignments" description="Test your knowledge with practical coding challenges and quizzes." />;
export const Projects = () => <PlaceholderPage title="Projects" description="Build a portfolio of real-world AI applications." />;
export const Progress = () => <PlaceholderPage title="Your Progress" description="Track your learning metrics, completed modules, and earned badges." />;
