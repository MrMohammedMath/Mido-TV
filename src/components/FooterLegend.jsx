import React from 'react';

export const FooterLegend = React.memo(({ isPlayerMode }) => {
  if (isPlayerMode) return null;

  return (
    <footer className="fixed bottom-0 w-full h-16 bg-surface-container-highest/95 backdrop-blur-xl flex items-center px-margin-edge border-t border-outline-variant/30 z-50">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-secondary text-on-secondary rounded font-bold text-sm">1-5</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Select Item</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-secondary text-on-secondary rounded font-bold text-sm">0</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Go Back</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-secondary text-on-secondary rounded font-bold text-sm">OK</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Pause / Play</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-primary text-on-primary rounded font-bold text-sm">A / F1</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Page Up</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-primary text-on-primary rounded font-bold text-sm">B / F2</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Page Down</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-primary text-on-primary rounded font-bold text-sm">C / F3</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Fullscreen</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-primary text-on-primary rounded font-bold text-sm">D / F4</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Refresh</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">settings_input_antenna</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider">CONNECTED</span>
        </div>
      </div>
    </footer>
  );
});

FooterLegend.displayName = 'FooterLegend';
