import React from 'react';
import { getPlaybackProgress } from '../services/fileScanner';

export const GridCard = React.memo(({ item, slotIndex, isFocused, playbackHistory, onClick }) => {
  if (!item) {
    // Empty slot place-holder (keeps 3x3 layout stable)
    return (
      <div className="w-full aspect-[2/3] rounded-xl bg-surface-container/30 border border-outline-variant/10 opacity-30 flex items-center justify-center">
        <span className="text-on-surface-variant font-label-sm uppercase">Empty Slot</span>
      </div>
    );
  }

  const badgeNumber = slotIndex + 1; // 1-9
  const isSingleVideoFolder = item.isSingleVideoFolder || !!item.singleVideoPath;
  const isFolder = (item.type === 'folder' || item.isDirectory) && !isSingleVideoFolder;
  const isVideo = !isFolder;
  const videoPath = item.singleVideoPath || item.path;

  // Retrieve playback history & calculate percentage
  let percentViewed = 0;
  if (isVideo && videoPath) {
    const progress = playbackHistory ? playbackHistory[videoPath] : getPlaybackProgress(videoPath);
    if (progress && progress.duration > 0 && progress.timestamp > 0) {
      percentViewed = Math.min(100, Math.max(0, Math.round((progress.timestamp / progress.duration) * 100)));
    }
  }

  const coverUrl = item.coverUrl;
  const aspectRatioClass = 'aspect-[2/3]';
  const displayName = item.name ? item.name.replace(/\.(mp4|mkv|avi|mov|webm|m4v|ts|flv|wmv)$/i, '') : '';
  const isArabic = /[\u0600-\u06FF]/.test(displayName);

  return (
    <button
      onClick={() => onClick(item, slotIndex)}
      className={`group relative flex flex-col w-full ${aspectRatioClass} rounded-xl bg-surface-container overflow-hidden transition-all duration-200 focus:outline-none ${
        isFocused
          ? 'ring-4 ring-primary scale-[1.04] shadow-[0_0_20px_rgba(47,217,244,0.6)] z-20'
          : 'hover:scale-[1.02] opacity-90'
      }`}
    >
      {/* Background Image / Fallback */}
      {coverUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full z-0 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${coverUrl}")` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center z-0">
          <span className="material-symbols-outlined text-[64px] text-outline-variant/40">
            {isFolder ? 'folder' : 'movie'}
          </span>
        </div>
      )}

      {/* Dark gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 via-45% to-transparent z-10" />

      {/* Numerical Badge 1-5 */}
      <div className="absolute top-4 left-4 z-20 w-11 h-11 flex items-center justify-center bg-secondary text-on-secondary rounded-lg shadow-md font-display-lg text-headline-md leading-none font-bold">
        {badgeNumber}
      </div>

      {/* Content Metadata */}
      <div className={`absolute bottom-4 left-5 right-5 z-20 flex flex-col justify-end ${isArabic ? 'items-end text-right' : 'items-start text-left'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-sm ${
            isFolder
              ? 'bg-primary/20 text-primary'
              : 'bg-secondary/20 text-secondary'
          }`}>
            <span className="material-symbols-outlined text-[14px] inline-block mr-1 align-text-top">
              {isFolder ? 'folder' : 'movie'}
            </span>
            {isFolder ? 'Folder' : 'Video'}
          </span>
        </div>

        <h3
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`font-headline-md text-headline-md text-on-background line-clamp-1 truncate w-full ${isArabic ? 'text-right' : 'text-left'}`}
        >
          {displayName}
        </h3>

        {/* Video Metadata & Progress Bar */}
        {!isFolder && (
          <div className="w-full mt-2 flex flex-col gap-1.5">
            {/* Metadata chips & Percentage viewed badge */}
            <div className={`flex items-center gap-2 w-full ${isArabic ? 'flex-row-reverse justify-between' : 'justify-between'}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.year && (
                  <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-highest/90 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                )}
                {item.duration && (
                  <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-highest/90 px-2 py-0.5 rounded">
                    {item.duration}
                  </span>
                )}
              </div>

              {/* Percentage Viewed Badge */}
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-md transition-all ${
                  percentViewed > 0
                    ? 'text-primary bg-primary/20 border border-primary/40 shadow-[0_0_8px_rgba(47,217,244,0.3)]'
                    : 'text-on-surface-variant/60 bg-surface-container-highest/60 border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[12px] leading-none">
                  {percentViewed >= 95 ? 'check_circle' : percentViewed > 0 ? 'play_arrow' : 'schedule'}
                </span>
                <span>{percentViewed > 0 ? `${percentViewed}% viewed` : '0% viewed'}</span>
              </span>
            </div>

            {/* In-Card Progress Bar Track */}
            <div className="w-full h-2 bg-surface-container-highest/80 rounded-full overflow-hidden border border-white/15 backdrop-blur-md relative mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentViewed > 0
                    ? 'bg-gradient-to-r from-primary via-primary-container to-secondary shadow-[0_0_10px_rgba(47,217,244,0.85)]'
                    : 'w-0'
                }`}
                style={{ width: `${percentViewed}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
});

GridCard.displayName = 'GridCard';
