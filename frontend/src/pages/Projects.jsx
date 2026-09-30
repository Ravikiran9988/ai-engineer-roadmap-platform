import React, { useState } from 'react';
import { PROJECTS } from '@/data/learningData';
import { PHASES } from '@/data/roadmap';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderGit2, CheckCircle2, GitBranch, AlertCircle, Link as LinkIcon, Trophy } from 'lucide-react';

export function Projects() {
  const { projects, submitProject } = useProgress();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [error, setError] = useState('');

  const displayProjects = PROJECTS;

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    let parsedGithub;
    try { parsedGithub = new URL(githubUrl); } catch { parsedGithub = null; }
    if (!parsedGithub || parsedGithub.protocol !== 'https:' || parsedGithub.hostname.toLowerCase() !== 'github.com') {
      setError('Please enter a valid HTTPS GitHub URL');
      return;
    }
    if (liveUrl) {
      let parsedLive;
      try { parsedLive = new URL(liveUrl); } catch { parsedLive = null; }
      if (!parsedLive || parsedLive.protocol !== 'https:') {
        setError('Live Demo URL must use HTTPS.');
        return;
      }
    }
    try {
      await submitProject(selectedProject.id, githubUrl, liveUrl);
      setGithubUrl('');
      setLiveUrl('');
      setError('');
      setSelectedProject(null);
    } catch (err) {
      setError(err.message || 'Unable to submit project.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground max-w-2xl">
          Build real-world AI applications. Complete phase projects to solidify your knowledge and the final capstone to prove your mastery.
        </p>
      </div>

      {!selectedProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {displayProjects.map(proj => {
            const phase = PHASES.find(p => p.id === proj.phaseId);
            const submission = projects[proj.id];
            const status = submission ? submission.status : 'Not Started';

            return (
              <Card key={proj.id} className={`flex flex-col transition-all ${proj.isCapstone ? 'border-purple-500/50 bg-purple-500/5' : 'hover:border-primary/50'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={proj.isCapstone ? 'default' : 'outline'} className={proj.isCapstone ? 'bg-purple-600 hover:bg-purple-700' : 'bg-secondary/50'}>
                      {proj.isCapstone ? <><Trophy className="w-3 h-3 mr-1" /> Capstone</> : phase?.name}
                    </Badge>
                    <Badge variant={status === 'Submitted' ? 'default' : 'secondary'}>{status}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{proj.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{proj.problemStatement}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Tech Stack</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.recommendedStack.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={submission ? "outline" : (proj.isCapstone ? "default" : "secondary")} 
                    className={`w-full gap-2 ${proj.isCapstone && !submission ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                    onClick={() => setSelectedProject(proj)}
                  >
                    {submission ? <><CheckCircle2 className="w-4 h-4" /> View Details</> : <><FolderGit2 className="w-4 h-4" /> Start Project</>}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="max-w-4xl border-primary/20 animate-in slide-in-from-bottom-4">
          <CardHeader className="border-b bg-secondary/20 pb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)} className="-ml-2">
                ← Back to List
              </Button>
              <Badge variant={projects[selectedProject.id] ? 'default' : 'secondary'}>
                {projects[selectedProject.id] ? projects[selectedProject.id].status : 'Not Started'}
              </Badge>
            </div>
            <CardTitle className="text-3xl flex items-center gap-3">
              {selectedProject.isCapstone && <Trophy className="w-8 h-8 text-purple-500" />}
              {selectedProject.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-8 text-sm">
            <div>
              <h3 className="font-bold text-xl mb-2">Problem Statement</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{selectedProject.problemStatement}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3 border-b pb-2">Requirements</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {selectedProject.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 border-b pb-2">Milestones</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {selectedProject.milestones.map((ms, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-xs font-bold">{idx + 1}</span> {ms}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <FolderGit2 className="w-6 h-6" /> Submit Project
              </h3>
              
              {projects[selectedProject.id] ? (
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                  <p className="font-medium flex items-center gap-2 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary" /> Project Submitted Successfully!
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-card p-3 rounded border">
                      <span className="text-muted-foreground block mb-1">GitHub Repo:</span>
                      <a href={projects[selectedProject.id].githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {projects[selectedProject.id].githubUrl}
                      </a>
                    </div>
                    {projects[selectedProject.id].liveUrl && (
                      <div className="bg-card p-3 rounded border">
                        <span className="text-muted-foreground block mb-1">Live Demo:</span>
                        <a href={projects[selectedProject.id].liveUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> {projects[selectedProject.id].liveUrl}
                        </a>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setGithubUrl(projects[selectedProject.id].githubUrl);
                    setLiveUrl(projects[selectedProject.id].liveUrl || '');
                  }}>
                    Update Submission
                  </Button>
                </div>
              ) : null}

              {(!projects[selectedProject.id] || githubUrl) && (
                <form onSubmit={handleSubmission} className="space-y-4 max-w-xl bg-secondary/20 p-6 rounded-xl border">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">GitHub Repository URL <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Live Demo URL <span className="text-muted-foreground font-normal">(Optional)</span></label>
                    <input
                      type="url"
                      placeholder="https://my-ai-app.vercel.app"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  {error && <p className="text-destructive flex items-center gap-1 text-xs"><AlertCircle className="w-3 h-3" /> {error}</p>}
                  <div className="pt-2">
                    <Button type="submit" size="lg">Submit Project</Button>
                    {projects[selectedProject.id] && (
                      <Button type="button" variant="ghost" onClick={() => { setGithubUrl(''); setLiveUrl(''); }} className="ml-2">Cancel Edit</Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
