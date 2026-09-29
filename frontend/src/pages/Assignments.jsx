import React, { useState } from 'react';
import { ASSIGNMENTS } from '@/data/learningData';
import { TOPICS, PHASES } from '@/data/roadmap';
import { useProgress } from '@/context/ProgressContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Assignments() {
  const { assignments, submitAssignment, activePath } = useProgress();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [GitBranchUrl, setGitBranchUrl] = useState('');
  const [error, setError] = useState('');

  // Filter assignments based on active path topics
  const validTopicIds = TOPICS.filter(t => t.paths.includes(activePath)).map(t => t.id);
  const pathAssignments = ASSIGNMENTS.filter(a => validTopicIds.includes(a.topicId));

  const handleSubmission = (e) => {
    e.preventDefault();
    if (!GitBranchUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL');
      return;
    }
    submitAssignment(selectedAssignment.id, GitBranchUrl);
    setGitBranchUrl('');
    setError('');
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground max-w-2xl">
          Test your knowledge with practical coding challenges. Submit your GitBranch repository links to mark them as completed.
        </p>
      </div>

      {!selectedAssignment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {pathAssignments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-xl">
              No assignments available for your current learning path.
            </div>
          ) : (
            pathAssignments.map(assign => {
              const topic = TOPICS.find(t => t.id === assign.topicId);
              const phase = PHASES.find(p => p.id === assign.phaseId);
              const submission = assignments[assign.id];
              const status = submission ? submission.status : 'Not Started';

              return (
                <Card key={assign.id} className={`flex flex-col ${submission ? 'border-primary/30 bg-primary/5' : 'hover:border-primary/50'} transition-all`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-secondary/50">{phase?.name.split(' ')[0]}</Badge>
                      <Badge variant={
                        status === 'Submitted' ? 'default' : 
                        status === 'Reviewed' ? 'default' : 'secondary'
                      }>
                        {status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{assign.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{assign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {assign.dueDate}</div>
                      <div className="capitalize">Diff: {assign.difficulty}</div>
                    </div>
                    {submission && (
                      <div className="text-sm border-t pt-3">
                        <span className="text-muted-foreground">Submitted: </span>
                        <a href={submission.url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate inline-block max-w-[200px] align-bottom">
                          {submission.url}
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={submission ? "outline" : "default"} 
                      className="w-full gap-2"
                      onClick={() => setSelectedAssignment(assign)}
                    >
                      {submission ? <><CheckCircle2 className="w-4 h-4" /> View Details</> : <><CheckSquare className="w-4 h-4" /> Start Assignment</>}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <Card className="max-w-3xl border-primary/20 animate-in slide-in-from-bottom-4">
          <CardHeader className="border-b bg-secondary/20 pb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAssignment(null)} className="-ml-2">
                ← Back to List
              </Button>
              <Badge variant={assignments[selectedAssignment.id] ? 'default' : 'secondary'}>
                {assignments[selectedAssignment.id] ? assignments[selectedAssignment.id].status : 'Not Started'}
              </Badge>
            </div>
            <CardTitle className="text-3xl">{selectedAssignment.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              Related Topic: <Link to={`/topic/${selectedAssignment.topicId}`} className="text-primary hover:underline">{TOPICS.find(t => t.id === selectedAssignment.topicId)?.name}</Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 text-sm">
            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{selectedAssignment.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Requirements</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {selectedAssignment.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Expected Output</h3>
                <p className="text-muted-foreground">{selectedAssignment.expectedOutput}</p>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5" /> Submit Assignment
              </h3>
              
              {assignments[selectedAssignment.id] ? (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <p className="font-medium flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Submission successful!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Repository URL: <a href={assignments[selectedAssignment.id].url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{assignments[selectedAssignment.id].url}</a>
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setGitBranchUrl(assignments[selectedAssignment.id].url)}>
                    Update Submission
                  </Button>
                </div>
              ) : null}

              {(!assignments[selectedAssignment.id] || GitBranchUrl) && (
                <form onSubmit={handleSubmission} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">GitBranch Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://GitBranch.com/username/repo"
                      value={GitBranchUrl}
                      onChange={(e) => setGitBranchUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                    {error && <p className="text-destructive flex items-center gap-1 text-xs"><AlertCircle className="w-3 h-3" /> {error}</p>}
                  </div>
                  <Button type="submit">Submit Solution</Button>
                  {assignments[selectedAssignment.id] && (
                    <Button type="button" variant="ghost" onClick={() => setGitBranchUrl('')} className="ml-2">Cancel Edit</Button>
                  )}
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
