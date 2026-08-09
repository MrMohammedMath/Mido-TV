import React, { useRef } from 'react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    const remMins = mins % 60;
    return `${hrs}:${remMins < 10 ? '0' : ''}${remMins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const PlayerHUD = React.memo(({
  videoItem,
  videoState,
  isVisible,
  onActivity,
  onTogglePlay,
  onSeekRatio,
  onSeekRelative,
  onCycleAspect,
  onGoBack,
  onToggleFullscreen
}) => {
  const { isPlaying, currentTime, duration, aspectLabel } = videoState;
  const progressBarRef = useRef(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTimelineClick = (e) => {
    e.stopPropagation();
    onActivity?.();
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeekRatio?.(ratio);
  };

  const handleContainerClick = (e) => {
    onActivity?.();
    onTogglePlay?.();
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-40 transition-opacity duration-500 ${
        isVisible ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-none'
      }`}
    >
      {/* Top Scrim */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-surface-dim/90 to-transparent z-10 pointer-events-none" />

      {/* Bottom Scrim */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-surface-dim/95 to-transparent z-10 pointer-events-none" />

      {/* Top Header Info */}
      <div className="absolute top-0 left-0 w-full p-margin-edge flex justify-between items-start z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <button
            onClick={onGoBack}
            className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            title="Back to Menu"
          >
            <span className="material-symbols-outlined text-[40px] text-on-primary">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-headline-lg font-headline-lg text-on-surface drop-shadow-md leading-none">
              Mido TV
            </h1>
            <h2 className="text-body-lg font-body-lg text-on-surface-variant mt-1 line-clamp-1">
              {videoItem?.name || 'Now Playing'}
            </h2>
          </div>
        </div>
      </div>

      {/* Right Side Shortcuts Cue Panel */}
      <div className="absolute right-0 p-margin-edge flex flex-col gap-4 z-20 top-0 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { onActivity?.(); onSeekRelative?.(-10); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">1</div>
          <span className="text-body-lg font-body-lg text-on-surface">-10s Jump</span>
        </button>

        <button
          onClick={() => { onActivity?.(); onSeekRelative?.(10); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">2</div>
          <span className="text-body-lg font-body-lg text-on-surface">+10s Jump</span>
        </button>

        <button
          onClick={() => { onActivity?.(); onCycleAspect?.(); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">3</div>
          <span className="text-body-lg font-body-lg text-on-surface">Aspect: {aspectLabel || 'Fill'}</span>
        </button>

        <button
          onClick={() => { onActivity?.(); onGoBack?.(); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">0</div>
          <span className="text-body-lg font-body-lg text-on-surface">Back to Menu</span>
        </button>

        <button
          onClick={() => { onActivity?.(); onTogglePlay?.(); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">OK</div>
          <span className="text-body-lg font-body-lg text-on-surface">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => { onActivity?.(); onToggleFullscreen?.(); }}
          className="flex items-center gap-4 bg-surface-container/90 backdrop-blur-md pl-3 pr-6 py-3 rounded-r-xl rounded-l-lg border-l-4 border-secondary hover:bg-surface-container-high transition-all"
        >
          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-on-secondary font-body-lg font-bold">C</div>
          <span className="text-body-lg font-body-lg text-on-surface">Fullscreen</span>
        </button>
      </div>

      {/* Bottom Transport OSD Bar */}
      <div className="absolute bottom-0 left-0 w-full px-margin-edge pb-margin-edge pt-8 z-20 flex flex-col gap-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        {/* Play / Pause Central Control Button */}
        <div className="flex items-center justify-center mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActivity?.();
              onTogglePlay?.();
            }}
            className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_30px_rgba(138,235,255,0.8)] border-4 border-primary-fixed ring-4 ring-primary-container ring-offset-4 ring-offset-surface-dim hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            <span className="material-symbols-outlined text-[56px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-end mb-1">
            <span className="text-body-lg font-body-lg text-on-surface drop-shadow-md font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Interactive Timeline Progress Bar */}
          <div
            ref={progressBarRef}
            onClick={handleTimelineClick}
            className="w-full h-5 bg-surface-variant/90 backdrop-blur-sm rounded-full overflow-hidden shadow-inner relative border border-outline-variant/40 cursor-pointer group hover:h-6 transition-all"
            title="Click to seek"
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(138,235,255,0.9)] rounded-r-full transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PlayerHUD.displayName = 'PlayerHUD';
