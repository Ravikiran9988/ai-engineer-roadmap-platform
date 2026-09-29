import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/services/api';
import { useProgress } from '@/context/ProgressContext';

let youtubeApiPromise;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise(resolve => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
  return youtubeApiPromise;
}

function getVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch { return null; }
}

export function YouTubePlayer({ video, onCompleted }) {
  const containerRef=useRef(null);
  const playerRef=useRef(null);
  const lastSavedRef=useRef(0);
  const [error,setError]=useState(false);
  const { markVideoComplete }=useProgress();
  const videoId=getVideoId(video.url);

  useEffect(()=>{
    if(!videoId || video.url==='RESOURCE_URL_PENDING') return;
    let mounted=true;
    loadYouTubeApi().then(YT=>{
      if(!mounted||!containerRef.current)return;
      playerRef.current=new YT.Player(containerRef.current,{
        videoId,
        playerVars:{rel:0,modestbranding:1,playsinline:1},
        events:{
          onReady:async e=>{
            try{
              const saved=await api.progress.getVideo(video.id);
              if(saved.progressSeconds>5) e.target.seekTo(saved.progressSeconds,true);
            }catch{}
          },
          onStateChange:e=>{
            if(e.data===YT.PlayerState.ENDED){
              saveProgress(true);
            } else if(e.data===YT.PlayerState.PLAYING){
              saveProgress(false);
            }
          },
          onError:()=>setError(true)
        }
      });
    });
    const timer=setInterval(()=>saveProgress(false),10000);
    return()=>{mounted=false;clearInterval(timer);playerRef.current?.destroy?.();playerRef.current=null;};
  },[videoId,video.id]);

  const saveProgress=async(forceComplete)=>{
    const p=playerRef.current;
    if(!p?.getCurrentTime||!p?.getDuration)return;
    const seconds=p.getCurrentTime();
    const duration=p.getDuration();
    if(!duration)return;
    const percent=Math.min(100,seconds/duration*100);
    if(!forceComplete && seconds-lastSavedRef.current<5)return;
    lastSavedRef.current=seconds;
    const completed=forceComplete||percent>=90;
    try{
      await api.progress.updateVideo(video.id,{progressSeconds:seconds,durationSeconds:duration,progressPercent:percent,completed});
      if(completed){
        markVideoComplete(video.id,true);
        onCompleted?.(video.id);
      }
    }catch{}
  };

  if(!videoId || video.url==='RESOURCE_URL_PENDING') return null;

  return <div className="space-y-2">
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      {!error?<div ref={containerRef} className="h-full w-full"/>:<div className="h-full flex items-center justify-center p-6 text-center text-sm text-muted-foreground">This video cannot be embedded. Use the YouTube link below.</div>}
    </div>
    <div className="text-xs text-muted-foreground">Progress is saved automatically. Videos are marked complete at 90% watched or when playback ends.</div>
  </div>;
}