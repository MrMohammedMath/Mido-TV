import React from 'react';
import { GridCard } from './GridCard';

export const Grid3x3 = React.memo(({ items, currentPage, totalPages, focusedSlotIndex, playbackHistory, onItemClick }) => {
  // Extract active 5 items for current page in 1 row
  const ITEMS_PER_PAGE = 5;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentSlots = Array.from({ length: ITEMS_PER_PAGE }, (_, idx) => items[startIndex + idx] || null);

  const hasPrevious = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center w-full max-w-[96vw] mx-auto py-2 px-6 lg:px-12">
      {/* 5-Item 1-Row Responsive Grid Container */}
      <div className="grid grid-cols-5 gap-6 lg:gap-8 w-full items-center">
        {currentSlots.map((item, slotIndex) => (
          <GridCard
            key={slotIndex} // Stable slot index key to prevent DOM unmount/remount on page change
            item={item}
            slotIndex={slotIndex}
            isFocused={slotIndex === focusedSlotIndex}
            playbackHistory={playbackHistory}
            onClick={onItemClick}
          />
        ))}
      </div>

      {/* Up Arrow Indicator on the Right Side of Screen (If more items above) */}
      {hasPrevious && (
        <div className="fixed right-6 top-1/3 -translate-y-1/2 z-30 flex flex-col items-center gap-1 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md border border-primary text-primary flex items-center justify-center shadow-[0_0_20px_rgba(47,217,244,0.4)]">
            <span className="material-symbols-outlined text-[36px]">keyboard_arrow_up</span>
          </div>
          <span className="font-label-sm text-xs text-primary uppercase tracking-widest bg-surface-container/90 px-2 py-0.5 rounded backdrop-blur-sm">
            [A/F1] Prev
          </span>
        </div>
      )}

      {/* Down Arrow Indicator on the Right Side of Screen (If more items below) */}
      {hasNext && (
        <div className="fixed right-6 bottom-1/3 translate-y-1/2 z-30 flex flex-col items-center gap-1 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md border border-primary text-primary flex items-center justify-center shadow-[0_0_20px_rgba(47,217,244,0.4)]">
            <span className="material-symbols-outlined text-[36px]">keyboard_arrow_down</span>
          </div>
          <span className="font-label-sm text-xs text-primary uppercase tracking-widest bg-surface-container/90 px-2 py-0.5 rounded backdrop-blur-sm">
            [B/F2] Next
          </span>
        </div>
      )}

      {/* Pagination Footer Bar */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between w-full px-6 py-2 bg-surface-container-high/40 rounded-xl backdrop-blur-md border border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              [1-5] Select • [A/F1] Prev Page • [B/F2] Next Page
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {items.length} Total Items
          </span>
        </div>
      )}
    </div>
  );
});

Grid3x3.displayName = 'Grid3x3';
