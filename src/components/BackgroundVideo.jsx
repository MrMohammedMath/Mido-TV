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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aspectIndex, setAspectIndex] = useState(0); // 0: Fill, 1: 16:9, 2: 4:3, 3: Fit

  // Stream URL resolution
  const streamUrl = videoItem?.path
    ? `/api/stream?path=${encodeURIComponent(videoItem.path)}`
    : (videoItem?.url || '');

  // Load video source and resume progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsBuffering(true);
    video.src = streamUrl;
    video.load();

    const history = getPlaybackProgress(videoItem?.path);
    if (history && history.timestamp > 0) {
      video.currentTime = history.timestamp;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(err => console.warn('Autoplay prevented or failed:', err));
    }
  }, [streamUrl, videoItem?.path]);

  // Periodic progress saving (every 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && video.currentTime > 0) {
        savePlaybackProgress(videoItem?.path, video.currentTime, video.duration || 0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videoItem?.path]);

  // Handle time update for HUD (1 second frequency)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    }
  };

  // Imperative handle for controls
  useImperativeHandle(ref, () => ({
    togglePlay() {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play();
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
      const target = Math.min(Math.max(0, video.currentTime + seconds), video.duration || 0);
      video.currentTime = target;
      setCurrentTime(target);
      savePlaybackProgress(videoItem?.path, target, video.duration || 0);
    },
    seekRatio(ratio) {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      setIsBuffering(true);
      const target = Math.min(Math.max(0, ratio * video.duration), video.duration);
      video.currentTime = target;
      setCurrentTime(target);
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
      return {
        isPlaying: currentlyPlaying,
        isBuffering,
        currentTime,
        duration,
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
        onLoadStart={() => setIsBuffering(true)}
        onWaiting={() => setIsBuffering(true)}
        onSeeking={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => setIsBuffering(false)}
        onSeeked={() => setIsBuffering(false)}
        onEnded={() => {
          setIsPlaying(false);
          savePlaybackProgress(videoItem?.path, 0, duration);
        }}
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

