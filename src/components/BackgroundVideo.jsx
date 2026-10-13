import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { getPlaybackProgress, savePlaybackProgress } from '../services/fileScanner';

const ASPECT_MODES = [
  { label: 'Fill', class: 'object-fill w-full h-full' },
  { label: '16:9', class: 'object-cover aspect-video' },
  { label: '4:3', class: 'object-contain aspect-[4/3] mx-auto' },
  { label: 'Fit', class: 'object-contain w-full h-full' }
];

export const BackgroundVideo = forwardRef(({ videoItem, isPlayerOpen }, ref) => {
  const videoRef = useRef(null);
  const resumeTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [bufferRange, setBufferRange] = useState({ startPercent: 0, endPercent: 0, forwardSeconds: 0 });
  const [aspectIndex, setAspectIndex] = useState(0); // 0: Fill, 1: 16:9, 2: 4:3, 3: Fit

  // Stream URL resolution
  const streamUrl = videoItem?.path
    ? `/api/stream?path=${encodeURIComponent(videoItem.path)}`
    : (videoItem?.url || '');

  // Calculate and update buffered range (Forward Buffer Cushion & Backward Garbage Collection)
  const updateBuffered = () => {
    const video = videoRef.current;
    if (!video || !video.buffered || video.buffered.length === 0) {
      const empty = { startPercent: 0, endPercent: 0, forwardSeconds: 0 };
      setBufferRange(empty);
      setBufferedPercent(0);
      return empty;
    }
    try {
      const cur = video.currentTime;
      let start = 0;
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        const bStart = video.buffered.start(i);
        const bEnd = video.buffered.end(i);
        if (cur >= bStart - 0.5 && cur <= bEnd + 0.5) {
          start = bStart;
          end = bEnd;
          break;
        }
      }
      if (end === 0 && video.buffered.length > 0) {
        start = video.buffered.start(0);
        end = video.buffered.end(video.buffered.length - 1);
      }
      const dur = (video.duration && isFinite(video.duration)) ? video.duration : (duration || 0);
      const startPct = dur > 0 ? (start / dur) * 100 : 0;
      const endPct = dur > 0 ? (end / dur) * 100 : 0;
      const forwardSec = Math.max(0, end - cur);

      const result = {
        startPercent: Math.min(100, Math.max(0, startPct)),
        endPercent: Math.min(100, Math.max(0, endPct)),
        forwardSeconds: Math.round(forwardSec)
      };
      setBufferRange(result);
      setBufferedPercent(result.endPercent);
      return result;
    } catch (e) {
      return { startPercent: 0, endPercent: 0, forwardSeconds: 0 };
    }
  };

  // Load video source and prepare resume progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsBuffering(true);
    setBufferedPercent(0);

    const history = getPlaybackProgress(videoItem?.path);
    let resumeTime = 0;
    if (history && history.timestamp > 0) {
      if (!history.duration || history.timestamp < history.duration - 5) {
        resumeTime = history.timestamp;
      }
    }
    resumeTimeRef.current = resumeTime;

    video.src = streamUrl;
    video.load();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(err => {
          console.warn('Autoplay prevented or failed:', err);
          setIsPlaying(false);
          setIsBuffering(false);
        });
    }
  }, [streamUrl, videoItem?.path]);

  // Periodic progress saving (every 5s) and cleanup on close
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended && video.currentTime > 0) {
        const dur = (video.duration && isFinite(video.duration)) ? video.duration : 0;
        if (dur === 0 || video.currentTime < dur - 5) {
          savePlaybackProgress(videoItem?.path, video.currentTime, dur);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      const video = videoRef.current;
      if (video && !video.ended && video.currentTime > 0) {
        const dur = (video.duration && isFinite(video.duration)) ? video.duration : 0;
        if (dur === 0 || video.currentTime < dur - 5) {
          savePlaybackProgress(videoItem?.path, video.currentTime, dur);
        }
      }
    };
  }, [videoItem?.path]);

  // Handle time update for HUD (1 second frequency)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      updateBuffered();
    }
  };

  // Imperative handle for controls
  useImperativeHandle(ref, () => ({
    togglePlay() {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    },
    seekRelative(seconds) {
      const video = videoRef.current;
      if (!video) return;
      setIsBuffering(true);
      const dur = (video.duration && isFinite(video.duration)) ? video.duration : (duration || 0);
      const maxSeek = dur > 0 ? Math.max(0, dur - 1) : 0;
      const target = Math.min(Math.max(0, video.currentTime + seconds), maxSeek || video.currentTime + seconds);
      video.currentTime = target;
      setCurrentTime(target);
      updateBuffered();
      savePlaybackProgress(videoItem?.path, target, dur);
    },
    seekRatio(ratio) {
      const video = videoRef.current;
      if (!video || !video.duration || !isFinite(video.duration)) return;
      setIsBuffering(true);
      const maxSeek = Math.max(0, video.duration - 1);
      const target = Math.min(Math.max(0, ratio * video.duration), maxSeek);
      video.currentTime = target;
      setCurrentTime(target);
      updateBuffered();
      savePlaybackProgress(videoItem?.path, target, video.duration);
    },
    cycleAspectRatio() {
      setAspectIndex(prev => (prev + 1) % ASPECT_MODES.length);
    },
    getAspectLabel() {
      return ASPECT_MODES[aspectIndex].label;
    },
    getState() {
      const video = videoRef.current;
      const currentlyPlaying = video ? (!video.paused && !video.ended) : isPlaying;
      const bufData = updateBuffered();
      return {
        isPlaying: currentlyPlaying,
        isBuffering,
        currentTime: video ? video.currentTime : currentTime,
        duration: (video && isFinite(video.duration)) ? video.duration : (duration || 0),
        bufferedPercent: bufData?.endPercent ?? bufferedPercent,
        bufferRange: bufData ?? bufferRange,
        aspectLabel: ASPECT_MODES[aspectIndex].label
      };
    }
  }));

  // Do not render or keep video playing if player is closed or no video selected
  if (!videoItem || !isPlayerOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className={`w-full h-full transition-all duration-300 ${ASPECT_MODES[aspectIndex].class}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => {
          const dur = e.target.duration;
          if (dur && isFinite(dur)) {
            setDuration(dur);
          }
          if (resumeTimeRef.current > 0) {
            const target = (dur && isFinite(dur))
              ? Math.min(resumeTimeRef.current, Math.max(0, dur - 2))
              : resumeTimeRef.current;
            try {
              e.target.currentTime = target;
              setCurrentTime(target);
            } catch (err) {
              console.warn('Error setting resume time:', err);
            }
            resumeTimeRef.current = 0;
          }
          updateBuffered();
        }}
        onLoadStart={() => setIsBuffering(true)}
        onWaiting={() => setIsBuffering(true)}
        onSeeking={() => setIsBuffering(true)}
        onCanPlay={() => {
          setIsBuffering(false);
          updateBuffered();
        }}
        onCanPlayThrough={() => {
          setIsBuffering(false);
          updateBuffered();
        }}
        onProgress={updateBuffered}
        onPlaying={() => setIsBuffering(false)}
        onSeeked={() => {
          setIsBuffering(false);
          updateBuffered();
        }}
        onEnded={() => {
          setIsPlaying(false);
          setIsBuffering(false);
          savePlaybackProgress(videoItem?.path, 0, duration);
        }}
        onError={(e) => {
          console.error('Video error encountered:', e.target.error);
          setIsBuffering(false);
          setIsPlaying(false);
        }}
        preload="auto"
        playsInline
      />

      {/* Loading Spinner Overlay when video is loading or buffering */}
      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30 pointer-events-none transition-opacity duration-300">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(47,217,244,0.8)] mb-4" />
          <span className="text-on-surface font-headline-md text-headline-md tracking-wider drop-shadow-lg font-semibold">
            Loading Video...
          </span>
        </div>
      )}
    </div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';


