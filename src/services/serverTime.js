// Server Time Synchronization Service
// Guarantees that the client (e.g. Samsung Smart TV) displays the authoritative host server time
// regardless of local TV clock inaccuracy, missing TV NTP sync, or unsupported Tizen timezones.

let isSynced = false;
let syncServerSecondsOfDay = 0; // Local seconds into the server's day (0..86399)
let syncMonotonicMs = 0;        // Client monotonic timestamp when sync was anchored
let syncServerTimeMs = 0;       // Authoritative UTC server milliseconds
let serverTimeZone = 'UTC';
let serverTimezoneOffset = 0;   // Difference in minutes (UTC - local)
let isSyncing = false;
const syncListeners = new Set();

const STORAGE_KEY = 'mido_tv_host_server_time_anchor';

/**
 * Returns a monotonic timestamp (unaffected by local RTC adjustments) if supported.
 */
function getMonotonicNow() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

/**
 * Applies server time data and calculates exact server local seconds of day.
 * Uses pure UTC getters to completely eliminate any client TV timezone interference.
 */
function applyServerPayload(data, latencyMs = 0) {
  if (!data || (typeof data.hours !== 'number' && typeof data.serverTime !== 'number')) {
    return;
  }

  const nowMono = getMonotonicNow();
  serverTimeZone = data.timeZone || 'UTC';
  serverTimezoneOffset = typeof data.timezoneOffset === 'number' ? data.timezoneOffset : 0;
  syncServerTimeMs = (data.serverTime || Date.now()) + latencyMs;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (typeof data.hours === 'number' && typeof data.minutes === 'number') {
    hours = data.hours;
    minutes = data.minutes;
    seconds = typeof data.seconds === 'number' ? data.seconds : 0;
  } else {
    // Mathematically shift UTC ms by server's timezone offset
    // (timezoneOffset is in minutes: UTC - local)
    const serverLocalMs = data.serverTime - (serverTimezoneOffset * 60 * 1000) + latencyMs;
    const d = new Date(serverLocalMs);
    // Use getUTC* to avoid the client TV's local timezone being applied!
    hours = d.getUTCHours();
    minutes = d.getUTCMinutes();
    seconds = d.getUTCSeconds();
  }

  const baseSeconds = (hours * 3600) + (minutes * 60) + seconds + (latencyMs / 1000);
  syncServerSecondsOfDay = baseSeconds % 86400;
  syncMonotonicMs = nowMono;
  isSynced = true;

  // Persist anchor for instant reload restoration before network fetch returns
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      secondsOfDay: syncServerSecondsOfDay,
      savedAt: Date.now(),
      tz: serverTimeZone,
      offset: serverTimezoneOffset
    }));
  } catch (e) {}

  notifyListeners();
}

function notifyListeners() {
  syncListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error('Error in sync listener:', e);
    }
  });
}

/**
 * Attempt to restore the cached server time anchor from storage (zero-flash startup).
 */
function tryRestoreCachedAnchor() {
  if (isSynced) return;
  try {
    // 1. Check window inline injection from Vite transformIndexHtml
    if (typeof window !== 'undefined' && window.__INITIAL_SERVER_TIME__) {
      applyServerPayload(window.__INITIAL_SERVER_TIME__, 0);
      return;
    }

    // 2. Check session storage anchor
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      const elapsedSinceSave = (Date.now() - cached.savedAt) / 1000;
      if (elapsedSinceSave >= 0 && elapsedSinceSave < 3600) {
        syncServerSecondsOfDay = (cached.secondsOfDay + elapsedSinceSave) % 86400;
        syncMonotonicMs = getMonotonicNow();
        serverTimeZone = cached.tz || 'UTC';
        serverTimezoneOffset = cached.offset || 0;
        isSynced = true;
      }
    }
  } catch (e) {}
}

/**
 * Synchronize with the host server's authoritative clock.
 * Compatible with all TV web engines (avoids invalid fetch options).
 */
export async function syncServerTime() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const tStart = getMonotonicNow();
    // Cache-busting query parameter ensures fresh server time on all smart TVs
    const url = `/api/time?_t=${Date.now()}`;

    let data = null;

    if (typeof fetch === 'function') {
      try {
        const response = await fetch(url, {
          method: 'GET'
          // Note: Avoid cache: 'no-store' here as it throws on older Samsung Tizen engines
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (e) {
        // Fallback to XMLHttpRequest below
      }
    }

    // Fallback using standard XMLHttpRequest for maximum smart TV compatibility
    if (!data && typeof XMLHttpRequest !== 'undefined') {
      data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = 5000;
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (err) {
                reject(err);
              }
            } else {
              reject(new Error(`XHR HTTP ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('XHR Network error'));
        xhr.ontimeout = () => reject(new Error('XHR Timeout'));
        xhr.send();
      }).catch(() => null);
    }

    if (data) {
      const tEnd = getMonotonicNow();
      const latency = Math.max(0, (tEnd - tStart) / 2);
      applyServerPayload(data, latency);
    }
  } catch (err) {
    // Keep running smoothly using existing sync anchor
  } finally {
    isSyncing = false;
  }
}

/**
 * Formats the authoritative host server time into a clean string (e.g. "8:25 PM" or "20:25").
 * Uses pure arithmetic from the server baseline, totally immune to client TV timezone/clock errors.
 */
export function getServerTimeString(options = {}) {
  if (!isSynced) {
    tryRestoreCachedAnchor();
  }

  let totalSeconds = 0;

  if (isSynced) {
    const nowMono = getMonotonicNow();
    const elapsedSec = Math.max(0, (nowMono - syncMonotonicMs) / 1000);
    totalSeconds = Math.floor(syncServerSecondsOfDay + elapsedSec) % 86400;
    if (totalSeconds < 0) totalSeconds += 86400;
  } else {
    // Ultimate fallback only if TV has never communicated with the server
    const d = new Date();
    totalSeconds = (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
  }

  const hours24 = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (options.format === '24') {
    const hStr = hours24 < 10 ? `0${hours24}` : `${hours24}`;
    return options.showSeconds ? `${hStr}:${mStr}:${sStr}` : `${hStr}:${mStr}`;
  }

  // 12-hour format with AM/PM (Standard for Host Server)
  const h12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  return options.showSeconds ? `${h12}:${mStr}:${sStr} ${ampm}` : `${h12}:${mStr} ${ampm}`;
}

/**
 * Returns current server timestamp in milliseconds.
 */
export function getCurrentServerMs() {
  if (!isSynced) {
    tryRestoreCachedAnchor();
  }
  if (!isSynced) {
    return Date.now();
  }
  const nowMono = getMonotonicNow();
  const elapsedMs = Math.max(0, nowMono - syncMonotonicMs);
  return syncServerTimeMs + elapsedMs;
}

/**
 * Subscribe to sync events.
 */
export function subscribeServerTimeSync(callback) {
  syncListeners.add(callback);
  return () => syncListeners.delete(callback);
}

// Auto-initialize background synchronization
if (typeof window !== 'undefined') {
  // 1. Immediately try restoring any cached anchor
  tryRestoreCachedAnchor();

  // 2. Fetch fresh server time immediately
  syncServerTime();

  // 3. Periodic resynchronization every 30 seconds to prevent clock drift
  setInterval(syncServerTime, 30000);

  // 4. Resynchronize immediately when TV screen turns back on or tab becomes visible
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncServerTime();
      }
    });
  }

  // 5. Resynchronize on window focus or network reconnect
  window.addEventListener('focus', () => syncServerTime());
  window.addEventListener('online', () => syncServerTime());
}
