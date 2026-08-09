import React from 'react';

export const Header = React.memo(({ currentPath, pathSegments }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md">
      <div className="h-24 px-margin-edge flex items-center justify-between">
        <div className="flex items-center gap-stack-md">
          <span className="font-headline-md text-headline-md text-primary tracking-tighter drop-shadow">
            Mido TV
          </span>
          <div className="h-8 w-[2px] bg-outline-variant"></div>
          <nav className="flex items-center text-on-surface-variant font-label-lg text-label-lg tracking-wide">
            <span className={pathSegments.length === 0 ? "text-on-surface font-semibold" : ""}>Home</span>
            {pathSegments.map((segment, idx) => (
              <React.Fragment key={idx}>
                <span className="material-symbols-outlined mx-2 text-[20px]">chevron_right</span>
                <span className={idx === pathSegments.length - 1 ? "text-on-surface font-semibold" : ""}>
                  {segment}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
