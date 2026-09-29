import React, { useState } from 'react';
import { PLAYLISTS } from '@/data/playlists';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Library } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Playlists() {
  const [search, setSearch] = useState('');
  
  // Group playlists by topicId (or phase if added to data)
  const filtered = PLAYLISTS.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.channel.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Library className="w-8 h-8 text-primary" /> Playlists
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A complete library of curated, supplementary YouTube playlists.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search playlists by title or channel..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(playlist => (
          <Card key={playlist.id} className="hover:border-primary/50 transition-colors flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{playlist.topicId}</Badge>
              </div>
              <CardTitle className="text-xl line-clamp-2">{playlist.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground mb-4">
                Channel: <span className="font-medium text-foreground">{playlist.channel}</span>
              </p>
              <Button className="w-full gap-2" variant="secondary" asChild>
                <a href={playlist.url !== 'RESOURCE_URL_PENDING' ? playlist.url : '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(playlist.url === 'RESOURCE_URL_PENDING') e.preventDefault() }}>
                  <ExternalLink className="w-4 h-4" />
                  {playlist.url === 'RESOURCE_URL_PENDING' ? 'Pending URL' : 'Open on YouTube'}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No playlists found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
