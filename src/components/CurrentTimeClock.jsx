import React, { useState, useEffect } from 'react';
import { getServerTimeString, subscribeServerTimeSync, syncServerTime } from '../services/serverTime';

export const CurrentTimeClock = React.memo(({ className = '' }) => {
  const [timeString, setTimeString] = useState(() => getServerTimeString());

  useEffect(() => {
    // Trigger sync when player view clock mounts
    syncServerTime();

    const updateTime = () => {
      setTimeString(getServerTimeString());
    };

    // Update time every second
    const timer = setInterval(updateTime, 1000);

    // Update immediately when server time sync finishes
    const unsubscribe = subscribeServerTimeSync(updateTime);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md border border-white/15 text-on-surface shadow-[0_4px_24px_rgba(0,0,0,0.7)] select-none pointer-events-none ${className}`}
    >
      <span className="material-symbols-outlined text-[22px] text-primary">schedule</span>
      <span className="text-lg font-mono font-semibold tracking-wider">{timeString}</span>
    </div>
  );
});

CurrentTimeClock.displayName = 'CurrentTimeClock';
