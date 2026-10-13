const PLAYBACK_KEY = 'mido_tv_playback_history';
const CACHE_KEY = 'mido_tv_folder_cache';

export async function fetchDirectory(path = 'D:\\Film') {
  try {
    const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    // Save to light cache in localStorage
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      cache[path] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      // Ignore quota errors
    }

    return data;
  } catch (err) {
    console.warn('Failed to fetch filesystem directly, loading from local cache:', err);
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      if (cache[path]) return cache[path];
    } catch (e) {}
    
    // Default fallback return structure
    return {
      path,
      isRoot: path === 'D:\\Film',
      parentPath: path === 'D:\\Film' ? null : 'D:\\Film',
      items: []
    };
  }
}

export function getPlaybackHistory() {
  try {
    return JSON.parse(localStorage.getItem(PLAYBACK_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

export function getPlaybackProgress(filePath) {
  if (!filePath) return null;
  const history = getPlaybackHistory();
  return history[filePath] || null;
}

export function getVideoProgressPercentage(filePath) {
  if (!filePath) return 0;
  const progress = getPlaybackProgress(filePath);
  if (!progress || !progress.duration || progress.duration <= 0 || !progress.timestamp) return 0;
  const pct = Math.round((progress.timestamp / progress.duration) * 100);
  return Math.min(100, Math.max(0, pct));
}

export function savePlaybackProgress(filePath, timestamp, duration) {
  if (!filePath) return;
  try {
    const history = getPlaybackHistory();
    const validDuration = Math.max(0, Math.floor(duration));
    let validTimestamp = Math.max(0, Math.floor(timestamp));
    // If the video was watched to within 5 seconds of the end, reset saved position to beginning
    if (validDuration > 0 && validTimestamp >= validDuration - 5) {
      validTimestamp = 0;
    }
    history[filePath] = {
      timestamp: validTimestamp,
      duration: validDuration,
      updatedAt: Date.now()
    };
    localStorage.setItem(PLAYBACK_KEY, JSON.stringify(history));
    window.dispatchEvent(new CustomEvent('mido-tv-playback-updated', {
      detail: { filePath, timestamp: validTimestamp, duration: validDuration }
    }));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}
