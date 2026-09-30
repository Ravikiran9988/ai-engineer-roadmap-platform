import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TOPICS, PHASES } from '@/data/roadmap';
import { getVideosForTopic } from '@/data/videos';
import { getPlaylistsForTopic } from '@/data/playlists';
import { getDocsForTopic } from '@/data/documentation';
import { getGithubForTopic } from '@/data/githubNotes';
import { getPracticeForTopic } from '@/data/practiceTasks';
import { ASSIGNMENTS } from '@/data/learningData';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, GitMerge,
  ExternalLink, PlayCircle, GitBranch, Code, FileText, GraduationCap,
  Filter, ListVideo, ChevronDown, ChevronUp, AlertCircle, ArrowRight
} from 'lucide-react';

// ─── Video Type Badge ────────────────────────────────────────────────────────
const VIDEO_TYPE_COLORS = {
  concept: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  implementation: 'bg-green-500/10 text-green-500 border-green-500/30',
  'deep-dive': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  project: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
};

const DIFFICULTY_COLORS = {
  beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  intermediate: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/30',
};

function VideoCard({ video, isWatched, onToggleWatched }) {
  const isPending = video.url === 'RESOURCE_URL_PENDING';

  return (
    <div className={`group border rounded-xl p-4 transition-all duration-200 ${
      isWatched ? 'bg-secondary/30 border-primary/20' : 'bg-card hover:border-primary/40 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-4">
        {/* Thumbnail / Play icon */}
        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          isWatched ? 'bg-primary/10' : 'bg-red-500/10'
        }`}>
          {isWatched
            ? <CheckCircle2 className="w-6 h-6 text-primary" />
            : <PlayCircle className="w-6 h-6 text-red-500" />
          }
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${VIDEO_TYPE_COLORS[video.type]}`}>
              {video.type}
            </Badge>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${DIFFICULTY_COLORS[video.difficulty]}`}>
              {video.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {video.duration}
            </span>
          </div>

          <h4 className={`font-semibold text-sm leading-snug ${isWatched ? 'line-through text-muted-foreground' : ''}`}>
            {video.title}
          </h4>

          <p className="text-xs text-muted-foreground">{video.channel}</p>

          {video.description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2">{video.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
        {isPending ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-500">
            <AlertCircle className="w-3 h-3" />
            <span>Resource coming soon</span>
          </div>
        ) : (
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Watch
          </a>
        )}

        <button
          onClick={() => onToggleWatched(video.id)}
          className={`ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
            isWatched
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          }`}
        >
          {isWatched ? <><CheckCircle2 className="w-3.5 h-3.5" /> Watched</> : <><Circle className="w-3.5 h-3.5" /> Mark Watched</>}
        </button>
      </div>
    </div>
  );
}

// ─── Resource Link Card ──────────────────────────────────────────────────────
function ResourceCard({ icon, title, description, url, colorClass = 'text-primary' }) {
  const isPending = !url || url === 'RESOURCE_URL_PENDING';
  return (
    <div className={`flex flex-col gap-2 p-4 border rounded-xl transition-colors bg-card ${
      isPending ? 'opacity-60' : 'hover:border-primary/50 cursor-pointer'
    }`}>
      <div className="flex items-center justify-between">
        <div className={colorClass}>{icon}</div>
        {isPending
          ? <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">Coming Soon</Badge>
          : <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {!isPending && (
        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1">
          Open →
        </a>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function TopicDetail() {
  const { topicId, pathId, phaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { completedTopics, completedSubtopics, completedVideos, markVideoComplete, assignments, submitAssignment, activePath } = useProgress();
  const currentPathId = pathId || activePath;
  const { toast } = useToast();

  // Video filter state
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);

  // Assignment submission state
  const [githubUrl, setGithubUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <Button onClick={() => navigate('/roadmap')}>Back to Roadmap</Button>
      </div>
    );
  }

  const phase = PHASES.find(p => p.id === topic.phaseId);
  const isComplete = completedTopics.includes(topic.id);
  const prereqTopics = topic.prerequisites.map(reqId => TOPICS.find(t => t.id === reqId)).filter(Boolean);

  // Data from centralized files
  const allVideos = getVideosForTopic(topicId);
  const playlists = getPlaylistsForTopic(topicId);
  const docs = getDocsForTopic(topicId);
  const github = getGithubForTopic(topicId);
  const practiceTasks = getPracticeForTopic(topicId, { path: currentPathId });
  const topicAssignment = ASSIGNMENTS.find(a => a.topicId === topicId);
  const submission = topicAssignment ? assignments[topicAssignment.id] : null;

  // Filter/sort videos
  const filteredVideos = useMemo(() => {
    let vids = allVideos
      .filter(v => v.learningPaths.includes(currentPathId))
      .filter(v => filterType === 'all' || v.type === filterType)
      .filter(v => filterDifficulty === 'all' || v.difficulty === filterDifficulty);

    if (sortBy === 'shortest') vids = [...vids].sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
    else if (sortBy === 'longest') vids = [...vids].sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
    else if (sortBy === 'beginner') {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      vids = [...vids].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else vids = [...vids].sort((a, b) => a.order - b.order);

    return vids;
  }, [allVideos, currentPathId, filterType, filterDifficulty, sortBy]);

  const watchedCount = filteredVideos.filter(v => completedVideos.includes(v.id)).length;
  const totalVideos = filteredVideos.length;
  const progressPct = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

  const handleAuthAction = (action) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    action();
  };
  const handleToggleWatched = (videoId) => {
    handleAuthAction(() => {
      markVideoComplete(videoId, !completedVideos.includes(videoId));
    });
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    handleAuthAction(async () => {
      let parsedGithub;
      try { parsedGithub = new URL(githubUrl); } catch { parsedGithub = null; }
      if (!parsedGithub || parsedGithub.protocol !== 'https:' || parsedGithub.hostname.toLowerCase() !== 'github.com') {
        setUrlError('Please enter a valid HTTPS GitHub URL (e.g. https://github.com/user/repo)');
        return;
      }
      try {
        await submitAssignment(topicAssignment.id, githubUrl);
        toast({ title: 'Assignment Submitted!', description: 'Your GitHub URL has been saved.' });
        setGithubUrl('');
        setUrlError('');
      } catch (err) {
        setUrlError(err.message || 'Unable to submit assignment.');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate('/roadmap')} className="hover:text-foreground transition-colors">Roadmap</button>
        <span>/</span>
        <button onClick={() => navigate(`/learning/${currentPathId}/${phase?.id}`)} className="hover:text-foreground transition-colors">{phase?.name}</button>
        <span>/</span>
        <span className="text-foreground font-medium">{topic.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-secondary/50">{phase?.name}</Badge>
            <Badge variant="outline" className={`capitalize ${DIFFICULTY_COLORS[topic.difficulty]}`}>{topic.difficulty}</Badge>
            <Badge variant="outline" className={`capitalize ${
              topic.priority === 'essential' ? 'border-red-500/50 text-red-500 bg-red-500/5' :
              topic.priority === 'recommended' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' :
              'border-blue-500/50 text-blue-500 bg-blue-500/5'
            }`}>{topic.priority}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {topic.timeEstimate}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{topic.name}</h1>
        </div>

        <div className="flex gap-3 shrink-0">
          {isComplete && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1 mt-4 sm:mt-0">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Overall Resource Progress */}
      <div className="bg-card border rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Topic Resources Completed</span>
          <span className="text-primary">{watchedCount} / {totalVideos}</span>
        </div>
        <Progress value={progressPct} className="h-2" />
        <p className="text-xs text-muted-foreground">{watchedCount} videos watched • {docs.length} docs available</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── MAIN COLUMN ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* 🎥 RECOMMENDED VIDEOS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" /> Recommended Videos
                <Badge className="ml-1">{filteredVideos.length}</Badge>
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Filter className="w-4 h-4" /> Filters
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Filter / Sort bar */}
            {showFilters && (
              <div className="p-4 bg-secondary/30 border rounded-xl space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Type</label>
                    <div className="flex flex-wrap gap-1">
                      {['all', 'concept', 'implementation', 'deep-dive', 'project'].map(t => (
                        <button
                          key={t}
                          onClick={() => setFilterType(t)}
                          className={`text-xs px-2 py-1 rounded-md border capitalize transition-colors ${
                            filterType === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Difficulty</label>
                    <div className="flex flex-wrap gap-1">
                      {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
                        <button
                          key={d}
                          onClick={() => setFilterDifficulty(d)}
                          className={`text-xs px-2 py-1 rounded-md border capitalize transition-colors ${
                            filterDifficulty === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Sort</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full text-xs bg-background border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="shortest">Shortest First</option>
                      <option value="longest">Longest First</option>
                      <option value="beginner">Beginner → Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {filteredVideos.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                No videos match your current filters or learning path.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isWatched={completedVideos.includes(video.id)}
                    onToggleWatched={handleToggleWatched}
                  />
                ))}
              </div>
            )}

            {/* 🎬 Full Playlists (supplementary) */}
            {playlists.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowPlaylists(!showPlaylists)}
                  className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                >
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <ListVideo className="w-4 h-4 text-muted-foreground" />
                    Full Playlists
                    <span className="text-xs text-muted-foreground">(Supplementary)</span>
                  </span>
                  {showPlaylists ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showPlaylists && (
                  <div className="p-4 space-y-3 border-t animate-in slide-in-from-top-2">
                    {playlists.map(pl => (
                      <div key={pl.id} className="flex items-start gap-3">
                        <PlayCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href={pl.url === 'RESOURCE_URL_PENDING' ? undefined : pl.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-sm font-medium ${pl.url === 'RESOURCE_URL_PENDING' ? 'text-muted-foreground cursor-not-allowed' : 'hover:text-primary hover:underline'}`}
                          >
                            {pl.title}
                          </a>
                          <p className="text-xs text-muted-foreground">{pl.channel}</p>
                        </div>
                        {pl.url === 'RESOURCE_URL_PENDING' && (
                          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40 shrink-0">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 📖 DOCUMENTATION */}
          {docs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Documentation
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {docs.map(doc => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 p-4 border rounded-xl hover:border-primary/50 hover:bg-secondary/30 transition-colors group"
                  >
                    <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{doc.title}</h4>
                        {doc.isPrimary && <Badge variant="outline" className="text-[10px] text-primary border-primary/40">Primary</Badge>}
                      </div>
                      {doc.description && <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 📝 GITHUB NOTES + 💻 CODE */}
          {github && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-foreground" /> GitHub Resources
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResourceCard
                  icon={<FileText className="w-5 h-5" />}
                  title="Notes"
                  description="Curated markdown summary"
                  url={github.notes}
                  colorClass="text-blue-500"
                />
                <ResourceCard
                  icon={<Code className="w-5 h-5" />}
                  title="Code Examples"
                  description="Runnable implementations"
                  url={github.code}
                  colorClass="text-purple-500"
                />
                <ResourceCard
                  icon={<FileText className="w-5 h-5" />}
                  title="Exercises"
                  description="Practice notebooks"
                  url={github.examples}
                  colorClass="text-green-500"
                />
              </div>
            </section>
          )}

          {/* 🧪 PRACTICE */}
          {practiceTasks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" /> Practice Tasks
              </h2>
              <div className="space-y-3">
                {practiceTasks.map(task => (
                  <div key={task.id} className="border rounded-xl p-4 space-y-3 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-[10px] capitalize ${DIFFICULTY_COLORS[task.difficulty]}`}>{task.difficulty}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {task.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.task}</p>
                    {task.requirements?.length > 0 && (
                      <ul className="space-y-1.5">
                        {task.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 📋 ASSIGNMENT */}
          {topicAssignment && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Assignment
              </h2>
              <div className="border rounded-xl overflow-hidden">
                <div className="p-5 bg-primary/5 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{topicAssignment.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{topicAssignment.description}</p>
                    </div>
                    <Badge className="capitalize shrink-0">{submission ? submission.status : 'Not Started'}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-1.5">
                        {topicAssignment.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Expected Output</h4>
                      <p className="text-sm text-muted-foreground">{topicAssignment.expectedOutput}</p>
                    </div>
                  </div>

                  {submission && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> Submitted
                      </p>
                      <a href={submission.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {submission.url}
                      </a>
                    </div>
                  )}

                  <form onSubmit={handleSubmitAssignment} className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <GitBranch className="w-4 h-4" /> {submission ? 'Update GitHub Repository URL' : 'Submit GitHub Repository URL'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={githubUrl || submission?.url || ''}
                        onChange={e => { setGithubUrl(e.target.value); setUrlError(''); }}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button type="submit" size="sm">{submission ? 'Update' : 'Submit'}</Button>
                    </div>
                    {urlError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {urlError}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Prerequisites */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-primary" /> Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prereqTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No prerequisites.</p>
              ) : (
                <ul className="space-y-2">
                  {prereqTopics.map(req => {
                    const done = completedTopics.includes(req.id);
                    return (
                      <li key={req.id} className="flex items-center justify-between py-1.5 text-sm">
                        <Link to={`/learning/${currentPathId}/${phaseId}/${req.id}`} className="hover:text-primary transition-colors font-medium truncate pr-2">{req.name}</Link>
                        {done ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Subtopics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.subtopics.map((sub, i) => {
                    const subId = topic.subtopicIds ? topic.subtopicIds[i] : sub.toLowerCase().replace(/\s+/g, '-');
                    const isSubComplete = completedSubtopics.includes(subId);
                    return (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubComplete ? 'bg-primary' : 'bg-primary/40'}`} />
                          <Link to={`/learning/${currentPathId}/${phaseId}/${topic.id}/${subId}`} className={isSubComplete ? 'line-through opacity-70' : ''}>
                            {sub}
                          </Link>
                        </div>
                        {isSubComplete && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Next Topic */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-5">
              <h3 className="font-semibold text-sm mb-1">Continue Learning</h3>
              <p className="text-xs text-muted-foreground mb-3">Complete this topic and move to the next one.</p>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate('/roadmap')}>
                View Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
