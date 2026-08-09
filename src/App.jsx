import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDirectory } from './services/fileScanner';
import { useTvRemote } from './hooks/useTvRemote';
import { Header } from './components/Header';
import { FooterLegend } from './components/FooterLegend';
import { Grid3x3 } from './components/Grid3x3';
import { BackgroundVideo } from './components/BackgroundVideo';
import { PlayerHUD } from './components/PlayerHUD';

const ROOT_PATH = 'D:\\Film';

export default function App() {
  const [currentPath, setCurrentPath] = useState(ROOT_PATH);
  const [pathSegments, setPathSegments] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Focus
  const [currentPage, setCurrentPage] = useState(0);
  const [focusedSlotIndex, setFocusedSlotIndex] = useState(0);

  // Player state
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    aspectLabel: '16:9'
  });

  const videoRef = useRef(null);
  const hudTimerRef = useRef(null);

  // Auto-hide HUD after 3 seconds of inactivity ONLY when video is playing
  const resetHudTimer = useCallback(() => {
    setHudVisible(true);
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);

    const isPlaying = videoRef.current ? videoRef.current.getState().isPlaying : true;

    if (isPlaying) {
      hudTimerRef.current = setTimeout(() => {
        setHudVisible(false);
      }, 3000);
    }
  }, []);

  // Sync HUD timer whenever player opens or play/pause state changes
  useEffect(() => {
    if (!isPlayerOpen) {
      setHudVisible(true);
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
      return;
    }

    resetHudTimer();
  }, [isPlayerOpen, videoState.isPlaying, resetHudTimer]);

  // Poll video state periodically for HUD OSD updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlayerOpen) {
        const state = videoRef.current.getState();
        setVideoState(state);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlayerOpen]);

  // Fetch items whenever current path changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDirectory(currentPath).then(data => {
      if (!isMounted) return;
      setItems(data.items || []);
      setLoading(false);

      // Compute breadcrumb segments
      if (data.path.toLowerCase() === ROOT_PATH.toLowerCase()) {
        setPathSegments([]);
      } else {
        const relative = data.path.substring(ROOT_PATH.length).replace(/^[/\\]+/, '');
        setPathSegments(relative.split(/[/\\]+/).filter(Boolean));
      }
    });

    return () => { isMounted = false; };
  }, [currentPath]);

  const totalPages = Math.max(1, Math.ceil(items.length / 5));

  // Navigate folder or launch video
  const handleItemSelect = useCallback((item) => {
    if (!item) return;

    const isSingleVideo = item.isSingleVideoFolder || !!item.singleVideoPath;
    const cleanTitle = item.name ? item.name.replace(/\.(mp4|mkv|avi|mov|webm|m4v|ts|flv|wmv)$/i, '') : '';

    if (isSingleVideo || item.type === 'video' || !item.isDirectory) {
      // Launch Video Player directly
      setActiveVideoItem({
        ...item,
        name: cleanTitle,
        path: item.singleVideoPath || item.path
      });
      setIsPlayerOpen(true);
      resetHudTimer();
    } else {
      // Open multi-item directory
      setCurrentPath(item.path);
      setCurrentPage(0);
      setFocusedSlotIndex(0);
    }
  }, [resetHudTimer]);

  // Stop video and exit player view completely back to grid
  const handleClosePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setActiveVideoItem(null);
  }, []);

  // Navigate up one directory level or close player
  const handleGoBack = useCallback(() => {
    if (isPlayerOpen) {
      handleClosePlayer();
      return;
    }

    if (currentPath.toLowerCase() !== ROOT_PATH.toLowerCase()) {
      const parts = currentPath.split(/[/\\]+/);
      parts.pop();
      const parent = parts.join('\\') || ROOT_PATH;
      setCurrentPath(parent);
      setCurrentPage(0);
      setFocusedSlotIndex(0);
    }
  }, [isPlayerOpen, currentPath, handleClosePlayer]);

  // Fullscreen toggle helper
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Auto-activate fullscreen mode on initial page load / user interaction
  useEffect(() => {
    const autoFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    // Attempt auto fullscreen on load
    autoFullscreen();

    // Fallback: activate fullscreen on first user gesture
    window.addEventListener('click', autoFullscreen, { once: true });
    window.addEventListener('keydown', autoFullscreen, { once: true });

    return () => {
      window.removeEventListener('click', autoFullscreen);
      window.removeEventListener('keydown', autoFullscreen);
    };
  }, []);

  // Video playback helper handlers
  const handleTogglePlay = useCallback(() => {
    videoRef.current?.togglePlay();
    if (videoRef.current) {
      const newState = videoRef.current.getState();
      setVideoState(newState);
      if (!newState.isPlaying) {
        setHudVisible(true);
        if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
      } else {
        resetHudTimer();
      }
    }
  }, [resetHudTimer]);

  const handleSeekRelative = useCallback((seconds) => {
    videoRef.current?.seekRelative(seconds);
    if (videoRef.current) setVideoState(videoRef.current.getState());
  }, []);

  const handleSeekRatio = useCallback((ratio) => {
    videoRef.current?.seekRatio(ratio);
    if (videoRef.current) setVideoState(videoRef.current.getState());
  }, []);

  const handleCycleAspect = useCallback(() => {
    videoRef.current?.cycleAspectRatio();
    if (videoRef.current) setVideoState(videoRef.current.getState());
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchDirectory(currentPath).then(data => {
      setItems(data.items || []);
      setLoading(false);
    });
  }, [currentPath]);

  // Remote key handler dispatch
  const handleTvKeyPress = useCallback((action) => {
    if (action === 'FULLSCREEN') {
      toggleFullscreen();
      return;
    }

    if (action === 'KEY_D') {
      handleRefresh();
      return;
    }

    if (isPlayerOpen) {
      resetHudTimer();

      switch (action) {
        case 'NUM_1':
          handleSeekRelative(-10);
          break;
        case 'NUM_2':
          handleSeekRelative(10);
          break;
        case 'NUM_3':
          handleCycleAspect();
          break;
        case 'NUM_0':
          handleClosePlayer();
          break;
        case 'OK':
          handleTogglePlay();
          break;
        case 'LEFT':
          handleSeekRelative(-10);
          break;
        case 'RIGHT':
          handleSeekRelative(10);
          break;
        case 'UP':
          handleSeekRelative(30);
          break;
        case 'DOWN':
          handleSeekRelative(-30);
          break;
        default:
          break;
      }
      return;
    }

    // Grid View Remote Shortcuts (5 Items Per Row)
    const startIndex = currentPage * 5;
    const currentSlots = Array.from({ length: 5 }, (_, idx) => items[startIndex + idx] || null);

    // Number keys 1-5 directly open items 1-5 on active page
    if (action.startsWith('NUM_')) {
      const num = parseInt(action.replace('NUM_', ''), 10);
      if (num === 0) {
        handleGoBack();
      } else if (num >= 1 && num <= 5) {
        const slotIdx = num - 1;
        setFocusedSlotIndex(slotIdx);
        if (currentSlots[slotIdx]) {
          handleItemSelect(currentSlots[slotIdx]);
        }
      }
      return;
    }

    switch (action) {
      case 'LEFT':
        if (focusedSlotIndex > 0) setFocusedSlotIndex(prev => prev - 1);
        break;
      case 'RIGHT':
        if (focusedSlotIndex < 4) setFocusedSlotIndex(prev => prev + 1);
        break;
      case 'UP':
      case 'PAGE_UP':
        setCurrentPage(prev => Math.max(0, prev - 1));
        setFocusedSlotIndex(0);
        break;
      case 'DOWN':
      case 'PAGE_DOWN':
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
        setFocusedSlotIndex(0);
        break;
      case 'OK':
        if (currentSlots[focusedSlotIndex]) {
          handleItemSelect(currentSlots[focusedSlotIndex]);
        }
        break;
      default:
        break;
    }
  }, [
    isPlayerOpen,
    currentPage,
    items,
    totalPages,
    focusedSlotIndex,
    handleItemSelect,
    handleGoBack,
    handleClosePlayer,
    handleTogglePlay,
    handleSeekRelative,
    handleCycleAspect,
    resetHudTimer,
    handleRefresh
  ]);

  // Hook remote listener
  useTvRemote(handleTvKeyPress);

  // Mouse activity listener for HUD timer
  useEffect(() => {
    if (!isPlayerOpen) return;

    let lastX = -1;
    let lastY = -1;

    const handleMouseMove = (e) => {
      if (lastX >= 0 && Math.abs(e.clientX - lastX) < 2 && Math.abs(e.clientY - lastY) < 2) return;
      lastX = e.clientX;
      lastY = e.clientY;
      resetHudTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlayerOpen, resetHudTimer]);

  return (
    <div className={`relative w-screen h-screen bg-background overflow-hidden flex flex-col font-inter select-none ${isPlayerOpen && !hudVisible ? 'cursor-none' : ''}`}>
      {/* Background HTML5 Video Element (Only active when player is open) */}
      <BackgroundVideo
        ref={videoRef}
        videoItem={activeVideoItem}
        isPlayerOpen={isPlayerOpen}
      />

      {/* Grid View & Layout */}
      {!isPlayerOpen && (
        <div className="relative z-10 flex flex-col w-full h-full">
          <Header currentPath={currentPath} pathSegments={pathSegments} />

          <main className="flex-1 pt-20 pb-16 w-full px-4 md:px-8 flex flex-col justify-center items-center overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-on-surface-variant font-label-lg uppercase tracking-widest">
                  Scanning Media...
                </span>
              </div>
            ) : (
              <Grid3x3
                items={items}
                currentPage={currentPage}
                totalPages={totalPages}
                focusedSlotIndex={focusedSlotIndex}
                onItemClick={handleItemSelect}
              />
            )}
          </main>

          <FooterLegend isPlayerMode={false} />
        </div>
      )}

      {/* Player HUD Overlay */}
      {isPlayerOpen && (
        <PlayerHUD
          videoItem={activeVideoItem}
          videoState={videoState}
          isVisible={hudVisible}
          onActivity={resetHudTimer}
          onTogglePlay={handleTogglePlay}
          onSeekRatio={handleSeekRatio}
          onSeekRelative={handleSeekRelative}
          onCycleAspect={handleCycleAspect}
          onGoBack={handleClosePlayer}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
}
