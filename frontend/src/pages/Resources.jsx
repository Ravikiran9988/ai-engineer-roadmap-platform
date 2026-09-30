import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { TOPICS, PHASES } from '@/data/roadmap';
import { VIDEOS } from '@/data/videos';
import { PLAYLISTS } from '@/data/playlists';
import { DOCUMENTATION } from '@/data/documentation';
import { GITHUB_NOTES } from '@/data/githubNotes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, PlayCircle, BookOpen, ExternalLink, Code, FileText, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/context/ProgressContext';

const TYPE_CONFIG = {
  video: { icon: <PlayCircle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Video' },
  playlist: { icon: <PlayCircle className="w-4 h-4" />, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Playlist' },
  doc: { icon: <BookOpen className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Documentation' },
  notes: { icon: <FileText className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Notes' },
  code: { icon: <Code className="w-4 h-4" />, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Code' },
};

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const location = useLocation();
  const { activePath } = useProgress();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location]);

  // Build unified resource list from centralized data files
  const allResources = useMemo(() => {
    const resources = [];

    VIDEOS.forEach(v => {
      const topic = TOPICS.find(t => t.id === v.topicId);
      const phase = topic ? PHASES.find(p => p.id === topic.phaseId) : null;
      resources.push({
        id: v.id,
        title: v.title,
        url: v.url,
        type: 'video',
        channel: v.channel,
        duration: v.duration,
        subType: v.type,
        difficulty: v.difficulty,
        topic,
        phase,
        isPending: v.url === 'RESOURCE_URL_PENDING',
      });
    });

    PLAYLISTS.forEach(pl => {
      const topic = TOPICS.find(t => t.id === pl.topicId);
      const phase = topic ? PHASES.find(p => p.id === topic.phaseId) : null;
      resources.push({
        id: pl.id,
        title: pl.title,
        url: pl.url,
        type: 'playlist',
        channel: pl.channel,
        description: pl.description,
        topic,
        phase,
        isPending: pl.url === 'RESOURCE_URL_PENDING',
      });
    });

    DOCUMENTATION.forEach(doc => {
      const topic = TOPICS.find(t => t.id === doc.topicId);
      const phase = topic ? PHASES.find(p => p.id === topic.phaseId) : null;
      resources.push({
        id: doc.id,
        title: doc.title,
        url: doc.url,
        type: 'doc',
        description: doc.description,
        topic,
        phase,
        isPending: false,
      });
    });

    GITHUB_NOTES.forEach(gh => {
      const topic = TOPICS.find(t => t.id === gh.topicId);
      const phase = topic ? PHASES.find(p => p.id === topic.phaseId) : null;
      if (gh.notes !== 'RESOURCE_URL_PENDING') {
        resources.push({ id: `gh-notes-${gh.topicId}`, title: `${topic?.name || gh.topicId} — Notes`, url: gh.notes, type: 'notes', topic, phase, isPending: false });
      }
      if (gh.code !== 'RESOURCE_URL_PENDING') {
        resources.push({ id: `gh-code-${gh.topicId}`, title: `${topic?.name || gh.topicId} — Code`, url: gh.code, type: 'code', topic, phase, isPending: false });
      }
    });

    return resources;
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allResources.filter(res => {
      const matchesSearch = !q ||
        res.title.toLowerCase().includes(q) ||
        res.topic?.name.toLowerCase().includes(q) ||
        res.phase?.title.toLowerCase().includes(q) ||
        (res.channel || '').toLowerCase().includes(q);
      const matchesType = filterType === 'all' || res.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [allResources, searchQuery, filterType]);

  const pendingCount = filteredResources.filter(r => r.isPending).length;
  const availableCount = filteredResources.filter(r => !r.isPending).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Resources Library</h1>
        <p className="text-muted-foreground max-w-2xl">
          All videos, documentation, code, and notes across the entire roadmap — sourced from{' '}
          <code className="text-xs bg-secondary px-1 py-0.5 rounded">src/data/videos.js</code>,{' '}
          <code className="text-xs bg-secondary px-1 py-0.5 rounded">documentation.js</code>, and{' '}
          <code className="text-xs bg-secondary px-1 py-0.5 rounded">githubNotes.js</code>.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-card border rounded-xl p-4 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources, topics, channels..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1"><Filter className="w-3 h-3" /> Type:</span>
          {['all', 'video', 'playlist', 'doc', 'notes', 'code'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                filterType === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary text-muted-foreground'
              }`}
            >
              {t === 'all' ? `All (${allResources.length})` : `${TYPE_CONFIG[t]?.label || t} (${allResources.filter(r => r.type === t).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{filteredResources.length} results</span>
        <span>{availableCount} available</span>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1 text-amber-500">
            <AlertCircle className="w-3.5 h-3.5" /> {pendingCount} pending
          </span>
        )}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          const cfg = TYPE_CONFIG[res.type] || TYPE_CONFIG.doc;
          return (
            <div key={res.id} className={`border rounded-xl bg-card flex flex-col transition-all ${
              res.isPending ? 'opacity-60' : 'hover:border-primary/50 hover:shadow-sm'
            }`}>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2 rounded-lg ${cfg.bg} ${cfg.color} shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {res.isPending && (
                      <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">Pending</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] capitalize">{cfg.label}</Badge>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">{res.title}</h3>
                  {(res.channel) && <p className="text-xs text-muted-foreground mt-1">{res.channel}</p>}
                  {(res.duration) && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">⏱ {res.duration}</p>
                  )}
                  {res.subType && <Badge variant="outline" className="text-[10px] mt-1.5 capitalize">{res.subType}</Badge>}
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2">
                  {res.topic && (
                    <Link to={`/learning/${activePath}/${res.topic.phaseId}/${res.topic.id}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      {res.phase?.title} / {res.topic.name} →
                    </Link>
                  )}
                  {!res.isPending && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-3 h-3" /> Open Resource
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-muted-foreground">
          <Search className="w-10 h-10 opacity-40" />
          <p className="font-medium">No resources found matching "{searchQuery}"</p>
          <button onClick={() => { setSearchQuery(''); setFilterType('all'); }} className="text-primary text-sm hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
