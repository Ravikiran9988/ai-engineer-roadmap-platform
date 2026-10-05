import React, { useState } from 'react';
import { KNOWLEDGE_BASE_FOLDERS } from '@/data/contentData';
import { TOPICS } from '@/data/roadmap';
import { getGithubForTopic } from '@/data/githubNotes';
import { getDocsForTopic } from '@/data/documentation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Search, BookOpen, Code, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/context/ProgressContext';

export function KnowledgeBase() {
  const [openFolders, setOpenFolders] = useState(['foundations']);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { activePath } = useProgress();

  const toggleFolder = (folderId) => {
    setOpenFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  const filteredFolders = KNOWLEDGE_BASE_FOLDERS.map(folder => {
    const filteredTopics = folder.topics.filter(topicId => {
      const t = TOPICS.find(t => t.id === topicId);
      if (!t) return false;
      return !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return { ...folder, filteredTopics };
  }).filter(folder =>
    folder.filteredTopics.length > 0 ||
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground max-w-2xl">
          File-explorer view of all structured notes, code examples, and documentation.
          GitHub links are managed in{' '}
          <code className="text-xs bg-secondary px-1 py-0.5 rounded">src/data/githubNotes.js</code>.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notes and topics..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card className="max-w-4xl overflow-hidden">
        <div className="border-b bg-secondary/50 p-4 font-mono text-sm text-muted-foreground flex items-center gap-2">
          <Folder className="w-4 h-4 text-blue-400" />
          <span className="font-bold">AI_ENGINEER_NOTES /</span>
          <span className="text-xs opacity-60">src/data/githubNotes.js</span>
        </div>

        <div className="p-2 font-mono text-sm">
          {filteredFolders.length === 0 ? (
            <div className="p-6 text-muted-foreground text-center text-sm">
              No results for "<span className="text-foreground">{searchQuery}</span>"
            </div>
          ) : (
            filteredFolders.map(folder => {
              const isOpen = openFolders.includes(folder.id) || searchQuery.length > 0;
              const topicsToRender = searchQuery ? folder.filteredTopics : folder.topics;

              return (
                <div key={folder.id} className="select-none">
                  <button
                    className="w-full flex items-center gap-2 p-2.5 hover:bg-secondary/50 rounded-md cursor-pointer text-foreground/90 transition-colors text-left"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                    {isOpen
                      ? <FolderOpen className="w-4 h-4 text-blue-400" />
                      : <Folder className="w-4 h-4 text-blue-400" />
                    }
                    <span className="font-semibold">{folder.name}</span>
                    <Badge variant="outline" className="ml-auto text-[10px] text-muted-foreground">{topicsToRender.length}</Badge>
                  </button>

                  {isOpen && (
                    <div className="ml-6 pl-2 border-l border-border/50 py-1 space-y-0.5">
                      {topicsToRender.map(topicId => {
                        const topic = TOPICS.find(t => t.id === topicId);
                        const github = getGithubForTopic(topicId);
                        const docs = getDocsForTopic(topicId);
                        if (!topic) return null;

                        const isExpanded = expandedTopic === topicId;

                        return (
                          <div key={topicId}>
                            <button
                              className="w-full flex items-center gap-2 p-2 hover:bg-secondary/30 rounded-md group transition-colors text-left"
                              onClick={() => setExpandedTopic(isExpanded ? null : topicId)}
                            >
                              <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors">
                                {topic.name}
                                <span className="text-xs opacity-50">.md</span>
                              </span>
                              {isExpanded
                                ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                              }
                            </button>

                            {isExpanded && (
                              <div className="ml-6 pl-2 border-l border-border/30 py-2 space-y-2 animate-in slide-in-from-top-1">
                                {/* GitHub Resources */}
                                {github && (
                                  <div className="space-y-1.5">
                                    {[
                                      { icon: <FileText className="w-3.5 h-3.5 text-blue-400" />, label: 'Notes', url: github.notes },
                                      { icon: <Code className="w-3.5 h-3.5 text-purple-400" />, label: 'Code', url: github.code },
                                    ].map(({ icon, label, url }) => (
                                      <div key={label} className="flex items-center gap-2 px-2 py-1">
                                        {icon}
                                        <span className="text-xs text-muted-foreground flex-1">{label}</span>
                                        {url === 'RESOURCE_URL_PENDING' ? (
                                          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">Pending</Badge>
                                        ) : (
                                          <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                            Open <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Primary doc */}
                                {docs.filter(d => d.isPrimary).map(doc => (
                                  <div key={doc.id} className="flex items-center gap-2 px-2 py-1">
                                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs text-muted-foreground flex-1 truncate">{doc.title}</span>
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                      Docs <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                ))}

                                <Link
                                  to={`/learning/${activePath}/${t.phaseId}/${topicId}`}
                                  className="flex items-center gap-1.5 text-xs text-primary hover:underline px-2 py-1 font-medium"
                                >
                                  View full topic →
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
