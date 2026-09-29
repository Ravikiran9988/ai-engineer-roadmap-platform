import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_MAP } from '@/data/topics';
import { ASSIGNMENTS } from '@/data/learningData';
import { resourceService } from '@/services/resourceService';
import { useProgress } from '@/context/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, PlayCircle, FileText, GitBranch, ExternalLink, Code, CheckSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export function SubtopicDetail() {
  const { pathId, phaseId, topicId, subtopicId } = useParams();
  const { 
    completedVideos, markVideoComplete, 
    assignments, isAssignmentSubmitted, submitAssignment,
    isResourceRead, markResourceRead,
    completedSubtopics, toggleSubtopic,
    activePath
  } = useProgress();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [githubUrl, setGithubUrl] = useState('');
  
  useEffect(() => {
    if (assignmentId && assignments[assignmentId]?.url) {
      setGithubUrl(assignments[assignmentId].url);
    }
  }, [assignmentId, assignments]);

  const topic = TOPIC_MAP[topicId];
  const subtopicIndex = topic?.subtopicIds ? topic.subtopicIds.indexOf(subtopicId) : topic?.subtopics.findIndex(s => s.toLowerCase().replace(/\s+/g, '-') === subtopicId);
  const subtopicName = subtopicIndex !== -1 ? topic?.subtopics[subtopicIndex] : 'Unknown Subtopic';

  const videos = useMemo(() => {
    return resourceService.getVideosForTopic(topicId).filter(v => v.subtopicId === subtopicId || !v.subtopicId);
  }, [topicId, subtopicId]);

  const docs = useMemo(() => {
    return resourceService.getDocsForTopic(topicId).filter(d => d.subtopicId === subtopicId || !d.subtopicId);
  }, [topicId, subtopicId]);

  const github = resourceService.getGithubForTopic(topicId);

  const subtopicAssignment = ASSIGNMENTS.find(a => a.subtopicId === subtopicId);
  const assignmentId = subtopicAssignment?.id;
  const submitted = assignmentId ? isAssignmentSubmitted(assignmentId) : false;
  const assignmentRequired = subtopicAssignment
    ? (!subtopicAssignment.requiredPaths || subtopicAssignment.requiredPaths.includes(activePath))
    : false;

  useEffect(() => {
    if (assignmentId && assignments[assignmentId]?.url) {
      setGithubUrl(assignments[assignmentId].url);
    }
  }, [assignmentId, assignments]);

  const requiredVideoIds = subtopicAssignment?.requiredVideoIds?.length
    ? subtopicAssignment.requiredVideoIds
    : videos.filter(v => v.required !== false).map(v => v.id);
  const requiredVideos = videos.filter(v => requiredVideoIds.includes(v.id));
  const videosDone = requiredVideoIds.every(id => completedVideos.includes(id));
  const assignmentDone = !subtopicAssignment || !assignmentRequired || !subtopicAssignment.githubRequired || submitted;
  const hasRequirements = requiredVideos.length > 0 || (subtopicAssignment && assignmentRequired);
  
  const isManuallyCompleted = completedSubtopics.includes(subtopicId);
  const isSubtopicComplete = hasRequirements ? (videosDone && assignmentDone) : isManuallyCompleted;

  const handleAuthAction = (action) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    action();
  };

  if (!topic) return <div className="p-8">Subtopic not found</div>;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <Link to={`/learning/${pathId}`} className="hover:text-primary">Learning</Link>
        <span>/</span>
        <Link to={`/learning/${pathId}/${phaseId}`} className="hover:text-primary">Phase</Link>
        <span>/</span>
        <Link to={`/learning/${pathId}/${phaseId}/${topicId}`} className="hover:text-primary">{topic.name}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{subtopicName}</span>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{subtopicName}</h1>
          {isSubtopicComplete && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-4 h-4 mr-1"/> Completed</Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
          Master the concepts of {subtopicName} through curated external resources and practical assignments.
        </p>
        
        {!hasRequirements && (
          <div className="mt-4">
            <Button 
              variant={isManuallyCompleted ? "outline" : "default"}
              onClick={() => handleAuthAction(() => toggleSubtopic(subtopicId))}
              className={isManuallyCompleted ? 'text-primary border-primary' : ''}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isManuallyCompleted ? "Completed" : "Mark Subtopic Complete"}
            </Button>
          </div>
        )}
      </div>

      {/* 1. What You'll Learn (Placeholder for now) */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Understand the fundamental principles of {subtopicName}.</li>
            <li>Apply these concepts in practical coding scenarios.</li>
            <li>Prepare for real-world AI engineering challenges.</li>
          </ul>
        </CardContent>
      </Card>

      {/* 2. Recommended Individual Videos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-primary" />
          Recommended Videos
        </h2>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(video => {
              const isDone = completedVideos?.includes(video.id);
              return (
                <Card key={video.id} className={`transition-all ${isDone ? 'bg-secondary/20 border-primary/20' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2 pr-2">{video.title}</CardTitle>
                      {video.required !== false ? (
                        <Badge variant="default" className="shrink-0">Required</Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0">Optional</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {video.channel} • {video.duration}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="default" className="w-full sm:w-auto gap-2" asChild disabled={video.url === 'RESOURCE_URL_PENDING'}>
                        <a href={video.url !== 'RESOURCE_URL_PENDING' ? video.url : '#'} target="_blank" rel="noreferrer" onClick={e => { if(video.url === 'RESOURCE_URL_PENDING') e.preventDefault(); }}>
                          <ExternalLink className="w-4 h-4" /> {video.url === 'RESOURCE_URL_PENDING' ? 'Pending URL' : 'Open on YouTube'}
                        </a>
                      </Button>
                      <Button
                        variant={isDone ? "outline" : "secondary"}
                        className="w-full sm:w-auto gap-2"
                        onClick={() => handleAuthAction(() => markVideoComplete(video.id, !isDone))}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-primary' : ''}`} />
                        {isDone ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No videos available for this subtopic yet.</p>
        )}
      </div>

      {/* 3 & 4 & 5. Docs, Notes, Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {docs.map(doc => {
              const isRead = isResourceRead(doc.url);
              return (
                <div key={doc.url} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border transition-colors ${isRead ? 'bg-secondary/20 border-primary/20' : 'hover:border-primary/50'}`}>
                  <a href={doc.url !== 'RESOURCE_URL_PENDING' ? doc.url : '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(doc.url === 'RESOURCE_URL_PENDING') e.preventDefault() }} className="flex-1">
                    <div className="font-medium text-foreground">{doc.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{doc.url === 'RESOURCE_URL_PENDING' ? 'Pending URL' : doc.url}</div>
                  </a>
                  <Button 
                    variant={isRead ? "outline" : "ghost"} 
                    size="sm"
                    className={`shrink-0 gap-2 ${isRead ? 'text-primary' : ''}`}
                    onClick={() => handleAuthAction(() => markResourceRead(doc.url, !isRead))}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isRead ? 'Read' : 'Mark as Read'}
                  </Button>
                </div>
              );
            })}
            {docs.length === 0 && <span className="text-muted-foreground text-sm">No documentation links.</span>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" /> Code & Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {github?.notes && (
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border transition-colors ${isResourceRead(github.notes) ? 'bg-secondary/20 border-primary/20' : 'hover:border-primary/50'}`}>
                <a href={github.notes !== 'RESOURCE_URL_PENDING' ? github.notes : '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(github.notes === 'RESOURCE_URL_PENDING') e.preventDefault() }} className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">GitHub Notes</div>
                    <div className="text-xs text-muted-foreground">{github.notes === 'RESOURCE_URL_PENDING' ? 'Pending URL' : 'Reference material'}</div>
                  </div>
                </a>
                <Button 
                  variant={isResourceRead(github.notes) ? "outline" : "ghost"} 
                  size="sm"
                  className={`shrink-0 gap-2 ${isResourceRead(github.notes) ? 'text-primary' : ''}`}
                  onClick={() => handleAuthAction(() => markResourceRead(github.notes, !isResourceRead(github.notes)))}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isResourceRead(github.notes) ? 'Read' : 'Mark as Read'}
                </Button>
              </div>
            )}
            {github?.code && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border hover:border-primary/50 transition-colors">
                <a href={github.code !== 'RESOURCE_URL_PENDING' ? github.code : '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(github.code === 'RESOURCE_URL_PENDING') e.preventDefault() }} className="flex items-center gap-3 flex-1">
                  <Code className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Code Examples</div>
                    <div className="text-xs text-muted-foreground">{github.code === 'RESOURCE_URL_PENDING' ? 'Pending URL' : 'Practical implementations'}</div>
                  </div>
                </a>
                <Button variant="ghost" size="sm" asChild>
                  <a href={github.code !== 'RESOURCE_URL_PENDING' ? github.code : '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(github.code === 'RESOURCE_URL_PENDING') e.preventDefault() }}>
                    <ExternalLink className="w-4 h-4 mr-2" /> View Code
                  </a>
                </Button>
              </div>
            )}
            {!github && <span className="text-muted-foreground text-sm">No GitHub resources available.</span>}
          </CardContent>
        </Card>
      </div>

      {/* 6. Assignment */}
      {subtopicAssignment && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-primary" />
                Hands-on Assignment: {subtopicAssignment.title}
              </CardTitle>
              {!assignmentRequired && <Badge variant="outline">Optional</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{subtopicAssignment.description}</h3>
              <div className="text-muted-foreground space-y-2 text-sm mt-4">
                <p className="font-medium text-foreground">Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {subtopicAssignment.requirements?.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 bg-secondary/30 p-4 rounded-lg border">
              <label className="text-sm font-medium">GitHub Repository URL</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="url" 
                  placeholder="https://github.com/your-username/repo" 
                  className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                />
                <Button 
                  onClick={() => handleAuthAction(() => {
                    if(githubUrl.trim()) submitAssignment(assignmentId, githubUrl);
                  })}
                  disabled={!githubUrl.trim() || (submitted && githubUrl === assignments[assignmentId]?.url)}
                  className="w-full sm:w-auto"
                >
                  {submitted ? 'Update Submission' : 'Submit Assignment'}
                </Button>
              </div>
              {submitted && <p className="text-sm text-green-500 font-medium mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Assignment successfully submitted!</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
