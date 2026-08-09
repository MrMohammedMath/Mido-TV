import React from 'react';

export const GridCard = React.memo(({ item, slotIndex, isFocused, onClick }) => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />

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

        {!isFolder && (item.year || item.duration) && (
          <div className="flex items-center gap-2 mt-2">
            {item.year && (
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-highest/80 px-2 py-0.5 rounded">
                {item.year}
              </span>
            )}
            {item.duration && (
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-highest/80 px-2 py-0.5 rounded">
                {item.duration}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
});

GridCard.displayName = 'GridCard';
